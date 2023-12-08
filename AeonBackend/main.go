package main

import (
	"log"

	"AeonBackend/server"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// connect to database
	dsn := "root:v1nhphuc@tcp(127.0.0.1:3306)/Aeon?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	// server
	server := server.NewServer("localhost:8080")
	server.RegisterEndpoint(db)
	server.Start()
}
