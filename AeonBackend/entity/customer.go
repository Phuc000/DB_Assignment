package entity

type Customer struct {
	CustomerID int    `json:"CustomerID" gorm:"column:CustomerID;primaryKey"`
	CAddress   string `json:"CAddress" gorm:"column:CAddress"`
	CFName     string `json:"CFName" gorm:"column:CFName"`
	CLName     string `json:"CLName" gorm:"column:CLName"`
	CPhone     string `json:"CPhone" gorm:"column:CPhone"`
}

type CustomerCreation struct {
	CustomerID int    `json:"CustomerID" gorm:"column:CustomerID;primaryKey"`
	CAddress   string `json:"CAddress" gorm:"column:CAddress"`
	CFName     string `json:"CFName" gorm:"column:CFName"`
	CLName     string `json:"CLName" gorm:"column:CLName"`
	CPhone     string `json:"CPhone" gorm:"column:CPhone"`
}

func (CustomerCreation) TableName() string { return "customer" }

type CustomerUpdate struct {
	CustomerID int    `json:"CustomerID" gorm:"column:CustomerID;primaryKey"`
	CAddress   string `json:"CAddress" gorm:"column:CAddress"`
	CFName     string `json:"CFName" gorm:"column:CFName"`
	CLName     string `json:"CLName" gorm:"column:CLName"`
	CPhone     string `json:"CPhone" gorm:"column:CPhone"`
}

func (CustomerUpdate) TableName() string { return "customer" }

type CustomerPromo struct {
	CustomerID int     `json:"CustomerID" gorm:"column:CustomerID;primaryKey"`
	Rank       string  `json:"customerRank" gorm:"column:customerRank"`
	Discount   float64 `json:"customerDiscount" gorm:"column:customerDiscount"`
}
