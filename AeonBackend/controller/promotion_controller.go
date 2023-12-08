package controller

import (
	"net/http"
	"strconv"

	"AeonBackend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewPromotionController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/promotion")
	{
		router.Use(CORS())
		router.GET("/", getAllPromotion(db))
		router.POST("/", createPromotion(db))
		router.DELETE("/:id", deletePromotion(db))
	}
}
func getAllPromotion(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var promotion []entity.Promotion
		if err := db.Table("promotion").Find(&promotion).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, promotion)
	}
}
func createPromotion(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var data entity.Promotion
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
			"new_customer": data.PromotionID,
		})
	}
}

func deletePromotion(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Where("EmployeeID = ?", id).Delete(&entity.Promotion{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": true})
	}
}
