package entity

import "time"

//should be hardcode database for store
type Store struct {
	StoreID     int       `json:"StoreID" gorm:"column:StoreID"`
	Name        string    `json:"Name" gorm:"column:Name"`
	OpeningDate time.Time `json:"OpeningDate" gorm:"column:OpeningDate"`
	ContactInfo string    `json:"ContactInfo" gorm:"column:ContactInfo"`
	Location    string    `json:"Location" gorm:"column:Location"`
}
