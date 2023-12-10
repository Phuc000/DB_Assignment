package controller

import (
	"net/http"

	"AeonBackend/entity"

	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewStoreController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/store")
	{
		router.Use(CORS())
		router.GET("/", getAllStore(db))
		router.GET("/:id", getStoreByID(db))
	}
}
func getStoreByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var store entity.Store
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Table("store").Where("StoreID = ?", id).First(&store).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, store)
	}
}
func getAllStore(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var store []entity.Store
		if err := db.Table("store").Find(&store).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, store)
	}
}
