package controller

import (
	"net/http"

	"AeonBackend/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewStoreController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/store")
	{
		router.Use(CORS())
		router.GET("/", getAllStore(db))
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
