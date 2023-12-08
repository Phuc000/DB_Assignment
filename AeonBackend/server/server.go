package server

import (
	"AeonBackend/controller"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server interface {
	Start() error
	Stop() error
	RegisterEndpoint(*gorm.DB)
}

type server struct {
	gin  *gin.Engine
	port string
}

func NewServer(port string) Server {
	return &server{
		gin:  gin.Default(),
		port: port,
	}
}

func (s *server) Start() error {
	// Create a new CORS middleware instance with your options
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // Add your frontend origin here
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	s.gin.Use(cors.New(config))

	return s.gin.Run(s.port)
}

func (s *server) Stop() error {
	return nil
}

func (s *server) RegisterEndpoint(db *gorm.DB) {
	controller.NewCustomerController(s.gin, db)
	controller.NewEmployeeController(s.gin, db)
	controller.NewProductController(s.gin, db)
	controller.NewPromotionController(s.gin, db)
	controller.NewStoreController(s.gin, db)
	controller.NewTransactionController(s.gin, db)
	controller.NewTakeOrderController(s.gin, db)
}
