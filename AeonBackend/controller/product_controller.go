package controller

import (
	"AeonBackend/entity" // Update with the correct import path
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewProductController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/products")
	{
		router.Use(CORS())
		router.GET("/category/:category", getListProductByCategory(db))
		router.GET("/promotion/:id", getListProductByPromotionID(db))
		router.GET("/promotion/", getListProductHavePromotion(db))
		router.GET("/store/:id", getListProductByStoreID(db))
		router.POST("/", createProduct(db))
		router.GET("/:id", getListStoreHaveProductByProductID(db))
		router.GET("/atstore/:id", getProductInformationAtStoreByID(db))
		router.GET("/top5products/:year", getTop5RevenueProduct(db))
		router.GET("/productatstore/:productid/:storeid", getProductAtAStore(db))
		router.GET("/promotionfromproduct/:id", getPromotionsOfProductID(db))
		router.PUT("/addtostore/:productid/:storeid/:amount", increaseProductAtStore(db))
	}
}
func increaseProductAtStore(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {

		productid, err := strconv.Atoi(c.Param("productid"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		storeid, err := strconv.Atoi(c.Param("storeid"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		amount, err := strconv.Atoi(c.Param("amount"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var existingProduct entity.At
		result := db.Table("at").First(&existingProduct, "ProductID = ? AND StoreID = ?", productid, storeid)
		if result.Error != nil {
			query := "INSERT INTO AT (ProductID, StoreID, NumberAtStore) VALUES (?,?,?)"
			db.Exec(query, productid, storeid, amount)
			c.JSON(http.StatusOK, gin.H{"success": true})
			return
		}
		newQuantity := existingProduct.NumberAtStore + amount
		query := "UPDATE AT SET NumberAtStore = ? WHERE ProductID = ? AND StoreID = ?"
		db.Exec(query, newQuantity, productid, storeid)
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

func getPromotionsOfProductID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		productID, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var promotions []entity.Promotion
		query := fmt.Sprintf(`
			SELECT
				PROMOTION.*
			FROM
				PROMOTION
				JOIN PROMOTEPRODUCT ON PROMOTION.PromotionID = PROMOTEPRODUCT.PromotionID
			WHERE
				PROMOTEPRODUCT.ProductID = ?
		`)

		db.Raw(query, productID).Scan(&promotions)
		c.JSON(http.StatusOK, promotions)
	}
}
func getProductAtAStore(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		product_id, err := strconv.Atoi(c.Param("productid"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		store_id, err := strconv.Atoi(c.Param("storeid"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var product entity.At
		if err := db.Table("at").Where("ProductID = ? AND StoreID=?", product_id, store_id).Find(&product).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, product)
	}
}
func getTop5RevenueProduct(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		year, err := strconv.Atoi(c.Param("year"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var results []entity.TempTop5Product
		query := fmt.Sprintf(`
			SELECT
				PRODUCT.ProductID,
				SUM((INCLUDE.NumberOfProductInBill * (PRODUCT.Price * (1 - PROMOTION.Discount)))) AS Revenue
			FROM
				INCLUDE
				JOIN BILL ON INCLUDE.TransactionID = BILL.TransactionID
				JOIN PRODUCT ON INCLUDE.ProductID = PRODUCT.ProductID
				JOIN PROMOTEBILL ON BILL.TransactionID = PROMOTEBILL.TransactionID
				JOIN PROMOTION ON PROMOTEBILL.PromotionID = PROMOTION.PromotionID
			WHERE
				YEAR(BILL.DateAndTime) = ?
			GROUP BY
				PRODUCT.ProductID
			ORDER BY
				Revenue DESC
			LIMIT 5
		`)

		db.Raw(query, year).Scan(&results)
		c.JSON(http.StatusOK, results)
	}
}
func getProductInformationAtStoreByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var products []entity.At
		if err := db.Table("at").Where("ProductID = ?", id).Find(&products).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}
func getListStoreHaveProductByProductID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var product entity.Product
		if err := db.Table("product").Where("ProductID = ?", id).First(&product).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, product)
	}
}
func createProduct(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var data entity.ProductCreation
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
			"new_customer": data.ProductID,
		})
	}
}

func getListProductByCategory(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		targetCategory := c.Param("category")
		var products []entity.Product
		if err := db.Table("product").Where("Category = ?", targetCategory).Find(&products).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}

func getListProductHavePromotion(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var promotedProducts []entity.Product
		if err := db.Table("product").Joins("JOIN promoteproduct ON product.ProductID = promoteproduct.ProductID").Find(&promotedProducts).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, promotedProducts)
	}
}
func getListProductByPromotionID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var products []entity.Product
		if err := db.Raw("CALL GetProductsByPromotion(?)", id).Scan(&products).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}

func getListProductByStoreID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var products []entity.Product
		if err := db.Raw("CALL GetProductsByStoreID(?)", id).Scan(&products).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}
