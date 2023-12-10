package controller

import (
	"AeonBackend/entity"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func getRandomCashierID(db *gorm.DB, storeID int) (int, error) {

	var cashierIDs []int

	// Select EmployeeIDs from the Cashier table for the given StoreID
	if err := db.Table("cashier").
		Where("StoreID = ?", storeID).
		Pluck("EmployeeID", &cashierIDs).
		Error; err != nil {
		return 0, err
	}

	// Check if there are any CashierIDs for the given StoreID
	if len(cashierIDs) == 0 {
		return 0, fmt.Errorf("no CashierIDs found for StoreID %d", storeID)
	}

	// Generate a random index to select a random CashierID
	rand.Seed(time.Now().UnixNano())
	randomIndex := rand.Intn(len(cashierIDs))

	// Return the random CashierID
	return cashierIDs[randomIndex], nil
}
func NewTransactionController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/transaction")
	{
		router.Use(CORS())
		router.POST("/", createBill(db))
		router.GET("/:id", getBillByID(db))
		router.POST("/items/", createInclude(db))
		router.GET("/items/:id", getAllItemsByBillID(db))
		router.GET("/last", getLastBillID(db))
		router.GET("/billpromotion/:id", getPromotionFromTransactionID(db))
		router.GET("/promotion/:id", getPromotionByID(db))
	}
}
func getPromotionByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		promotionID, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var promotion entity.Promotion
		if err := db.Table("promotion").Where("PromotionID = ?", promotionID).First(&promotion).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, promotion)
	}
}
func getPromotionFromTransactionID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		transactionID, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var includes []entity.Include
		db.Where("TransactionID = ?", transactionID).Find(&includes)

		var total float64
		for _, include := range includes {
			var product entity.Product
			db.Where("ProductID = ?", include.ProductID).First(&product)
			total += float64(include.NumberOfProductInBill) * product.Price
		}

		// Determine the PromotionID
		var promotionID int
		switch {
		case total > 2300000:
			promotionID = 710005
		case total > 2000000:
			promotionID = 710004
		case total > 1800000:
			promotionID = 710003
		case total > 1500000:
			promotionID = 710002
		case total > 1000000:
			promotionID = 710001
		default:
			promotionID = 0 // Or any default value you want
		}

		// Return the result
		c.JSON(http.StatusOK, gin.H{
			"TransactionID": transactionID,
			"Total":         total,
			"PromotionID":   promotionID,
		})
	}
}
func getLastBillID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var id int
		query := fmt.Sprintf(`
			SELECT MAX(TransactionID) AS MaxTransactionID
			FROM BILL;
		`)

		db.Raw(query).Scan(&id)
		c.JSON(http.StatusOK, id)
	}
}
func getAllItemsByBillID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var products []entity.Product

		if err := db.Raw("CALL GetItemsByTransactionID(?)", id).Scan(&products).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}
func createInclude(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var data entity.IncludeCreation
		if err := c.ShouldBind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		if err := db.Create(&data).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"new_include": data.TransactionID,
		})
	}
}
func createBill(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var data entity.BillCreation
		if err := c.ShouldBind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		cashierID, err := getRandomCashierID(db, data.StoreID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get random cashier ID"})
			return
		}
		bill := entity.Bill{
			TransactionID: data.TransactionID,
			PaymentMethod: data.PaymentMethod,
			DateAndTime:   data.DateAndTime,
			CustomerID:    data.CustomerID,
			StoreID:       data.StoreID,
			CashierID:     cashierID,
		}
		if err := db.Create(&bill).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"new_bill": bill.TransactionID,
		})
	}
}
func getBillByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var bill entity.Bill
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Table("bill").Where("TransactionID = ?", id).First(&bill).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, bill)
	}
}
