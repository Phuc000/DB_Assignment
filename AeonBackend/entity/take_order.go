package entity

type TakingOrdering struct {
	TransactionID int `json:"TransactionID" gorm:"column:TransactionID"`
	ShipperID     int `json:"ShipperID" gorm:"column:ShipperID"`
}

func (TakingOrdering) TableName() string { return "takingordering" }

type TakingOrderingCreation struct {
	TransactionID int `json:"TransactionID" gorm:"column:TransactionID"`
}

func (TakingOrderingCreation) TableName() string { return "takingordering" }
