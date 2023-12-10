package controller

import (
	"net/http"
	"strconv"

	"AeonBackend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewCustomerController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/customers")
	{
		router.Use(CORS())
		router.GET("/", getCustomerList(db))                           // list of customer
		router.GET("/:id", getCustomerByID(db))                        // get user info by ID
		router.PUT("/:id", updateCustomerInfoById(db))                 // edit an item by ID
		router.POST("/", createCustomer(db))                           // create customer
		router.GET("/login/:phone/:fullname", getCustomerForLogin(db)) //get customer by phone and name
		router.GET("/customer-rank/:customerID", getCustomerRank(db))
	}
}
func getCustomerRank(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get customer ID from the URL parameter
		customerID := c.Param("customerID")

		// Query products and amounts for the given customerID
		var includes []entity.Include
		if err := db.Table("include").Where("TransactionID IN (SELECT TransactionID FROM bill WHERE CustomerID = ?)", customerID).
			Find(&includes).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Calculate total money spent
		var totalMoneySpent float64
		for _, include := range includes {
			var product entity.Product
			if err := db.Table("product").Where("ProductID = ?", include.ProductID).First(&product).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			totalMoneySpent += product.Price * float64(include.NumberOfProductInBill) * 20000
		}

		// Calculate rank based on total money spent
		var rank string
		switch {
		case totalMoneySpent >= 100000000:
			rank = "platinum"
		case totalMoneySpent >= 50000000:
			rank = "gold"
		case totalMoneySpent >= 25000000:
			rank = "silver"
		case totalMoneySpent >= 10000000:
			rank = "iron"
		default:
			rank = "none"
		}

		// Return the result
		c.JSON(http.StatusOK, gin.H{"rank": rank})
	}
}
func getCustomerForLogin(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var customer entity.Customer
		var phone = c.Param("phone")
		var fullname = c.Param("fullname")
		if err := db.Table("customer").Where("CPhone = ? AND CONCAT(CFName,' ',CLName)=?", phone, fullname).First(&customer).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, customer)
	}
}
func createCustomer(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var data entity.CustomerCreation
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
			"new_customer": data.CustomerID,
		})
	}
}

func getCustomerList(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var customer []entity.Customer
		if err := db.Table("customer").Find(&customer).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, customer)
	}
}

func getCustomerByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var task entity.Customer
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
		if err := db.Table("customer").Where("CustomerID = ?", id).First(&task).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, task)
	}
}

func updateCustomerInfoById(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var data entity.CustomerUpdate
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
		if err := c.ShouldBind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		if err := db.Table("customer").Where("CustomerID = ?", id).Updates(&data).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"data": true,
		})
	}
}
