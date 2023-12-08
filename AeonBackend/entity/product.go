package entity

type Product struct {
	ProductID   int     `json:"ProductID" gorm:"column:ProductID"`
	Category    string  `json:"Category" gorm:"column:Category"`
	Description string  `json:"Description" gorm:"column:Description"`
	PName       string  `json:"PName" gorm:"column:PName"`
	Price       float64 `json:"Price" gorm:"column:Price"`
	Weight      float64 `json:"Weight" gorm:"column:Weight"`
}
type ProductCreation struct {
	ProductID   int     `json:"ProductID" gorm:"column:ProductID"`
	Category    string  `json:"Category" gorm:"column:Category"`
	Description string  `json:"Description" gorm:"column:Description"`
	PName       string  `json:"PName" gorm:"column:PName"`
	Price       float64 `json:"Price" gorm:"column:Price"`
	Weight      float64 `json:"Weight" gorm:"column:Weight"`
}

func (ProductCreation) TableName() string { return "product" }

type PromoteProduct struct {
	PromotionID int `json:"PromotionID" gorm:"column:PromotionID"`
	ProductID   int `json:"ProductID" gorm:"column:ProductID"`
}
type At struct {
	ProductID     int `json:"ProductID" gorm:"column:ProductID"`
	StoreID       int `json:"StoreID" gorm:"column:StoreID"`
	NumberAtStore int `json:"NumberAtStore" gorm:"column:NumberAtStore"`
}
