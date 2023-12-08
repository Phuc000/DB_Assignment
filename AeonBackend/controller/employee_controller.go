package controller

import (
	"AeonBackend/entity" // Update with the correct import path
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewEmployeeController(g *gin.Engine, db *gorm.DB) {
	router := g.Group("/employees")
	{
		router.Use(CORS())
		router.GET("/", getEmployeeList(db))
		router.GET("/:id", getEmployeeByID(db))
		router.PUT("/:id", updateEmployeeInfoByID(db))
		router.POST("/", createEmployee(db))
		router.DELETE("/:id", deleteEmployee(db))
	}
}

func createEmployee(db *gorm.DB) func(ctx *gin.Context) {
	return func(c *gin.Context) {
		var employeeData entity.EmployeeCreation
		if err := c.ShouldBind(&employeeData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Create Employee
		if err := db.Create(&employeeData).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Create associated EPhone
		var ePhoneData entity.EPhoneCreation
		if err := c.ShouldBind(&ePhoneData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ePhoneData.EmployeeID = employeeData.EmployeeID

		if err := db.Create(&ePhoneData).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"new_employee": employeeData})
	}
}

func getEmployeeList(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var employees []entity.Employee
		if err := db.Find(&employees).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, employees)
	}
}

func getEmployeeByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var employee entity.Employee
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Table("employee").Where("EmployeeID = ?", id).First(&employee).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, employee)
	}
}

func updateEmployeeInfoByID(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		var data entity.EmployeeUpdate
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := c.ShouldBind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Table("employee").Where("EmployeeID = ?", id).Updates(&data).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": true})
	}
}

func deleteEmployee(db *gorm.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Where("EmployeeID = ?", id).Delete(&entity.Employee{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": true})
	}
}
