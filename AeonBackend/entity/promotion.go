package entity

import "time"

type Promotion struct {
	PromotionID int       `json:"PromotionID" gorm:"column:PromotionID"`
	Discount    float64   `json:"Discount" gorm:"column:Discount"`
	Name        string    `json:"Name" gorm:"column:Name"`
	Description string    `json:"Description" gorm:"column:Description"`
	StartDay    time.Time `json:"StartDay" gorm:"column:StartDay"`
	EndDay      time.Time `json:"EndDay" gorm:"column:EndDay"`
}
type PromotionCreation struct {
	PromotionID int       `json:"PromotionID" gorm:"column:PromotionID"`
	Discount    float64   `json:"Discount" gorm:"column:Discount"`
	Name        string    `json:"Name" gorm:"column:Name"`
	Description string    `json:"Description" gorm:"column:Description"`
	StartDay    time.Time `json:"StartDay" gorm:"column:StartDay"`
	EndDay      time.Time `json:"EndDay" gorm:"column:EndDay"`
}

func (PromotionCreation) TableName() string { return "promotion" }
