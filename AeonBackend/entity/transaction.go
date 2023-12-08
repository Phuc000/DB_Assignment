package entity

import "time"

type Bill struct {
	TransactionID int       `json:"TransactionID" gorm:"column:TransactionID"`
	PaymentMethod string    `json:"PaymentMethod" gorm:"column:PaymentMethod"`
	DateAndTime   time.Time `json:"DateAndTime" gorm:"column:DateAndTime"`
	CustomerID    int       `json:"CustomerID" gorm:"column:CustomerID"`
	CashierID     int       `json:"CashierID" gorm:"column:CashierID"`
	StoreID       int       `json:"StoreID" gorm:"column:StoreID"`
}

func (Bill) TableName() string { return "bill" }

type Include struct {
	TransactionID         int `json:"TransactionID" gorm:"column:TransactionID"`
	ProductID             int `json:"ProductID" gorm:"column:ProductID"`
	NumberOfProductInBill int `json:"NumberOfProductInBill" gorm:"column:NumberOfProductInBill"`
}
type IncludeCreation struct {
	TransactionID         int `json:"TransactionID" gorm:"column:TransactionID"`
	ProductID             int `json:"ProductID" gorm:"column:ProductID"`
	NumberOfProductInBill int `json:"NumberOfProductInBill" gorm:"column:NumberOfProductInBill"`
}

func (IncludeCreation) TableName() string { return "include" }

type BillCreation struct {
	TransactionID int       `json:"TransactionID" gorm:"column:TransactionID"`
	PaymentMethod string    `json:"PaymentMethod" gorm:"column:PaymentMethod"`
	DateAndTime   time.Time `json:"DateAndTime" gorm:"column:DateAndTime"`
	CustomerID    int       `json:"CustomerID" gorm:"column:CustomerID"`
	StoreID       int       `json:"StoreID" gorm:"column:StoreID"`
	//random cashier in that StoreID
}
type Cashier struct {
	EmployeeID int    `json:"EmployeeID" gorm:"column:column:EmployeeID"`
	Shift      string `json:"Shift" gorm:"column:column:Shift"`
	StoreID    int    `json:"StoreID" gorm:"column:StoreID"`
}

func (BillCreation) TableName() string { return "bill" }
