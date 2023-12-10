package controller

import (
	"net/http"

	"AeonBackend/entity"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewTakeOrderController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/ship")
	{
		router.Use(CORS())
		router.POST("/order", createOrdering(db))
		
	}
}
func createOrdering(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var bill entity.Bill
		var takingOrderingCreation entity.TakingOrderingCreation
		if err := c.ShouldBindJSON(&takingOrderingCreation); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		if err := db.Table("bill").Where("TransactionID = ?", takingOrderingCreation.TransactionID).First(&bill).Error; err != nil {
			c.JSON(400, gin.H{"error": "Bill not found"})
			return
		}
		var freeShipper entity.Shipper

		var customer entity.Customer
		if err := db.Table("customer").Where("CustomerID = ?", bill.CustomerID).First(&customer).Error; err != nil {
			c.JSON(400, gin.H{"error": "Customer not found"})
			return
		}

		address := customer.CAddress
		println(address)
		parts := strings.Split(address, ",")
		area := parts[3]
		area = area[1:]
		println(area)
		if err := db.Table("shipper").Where("Area = ? AND Status = ?", area, "Active").First(&freeShipper).Error; err != nil {
			c.JSON(400, gin.H{"error": "No free shipper available for the specified area"})
			return
		}
		takingOrdering := entity.TakingOrdering{
			TransactionID: takingOrderingCreation.TransactionID,
			ShipperID:     freeShipper.ShipperID,
		}

		if err := db.Create(&takingOrdering).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"is_deliver_by": takingOrdering.ShipperID,
		})
	}
}
