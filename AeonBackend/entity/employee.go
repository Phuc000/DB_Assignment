package entity

type Employee struct {
	EmployeeID int     `json:"EmployeeID" gorm:"column:EmployeeID"`
	FirstName  string  `json:"FirstName" gorm:"column:FirstName"`
	Salary     float64 `json:"Salary " gorm:"column:Salary "`
	LastName   string  `json:"LastName " gorm:"column:LastName "`
	Address    string  `json:"Address " gorm:"column:Address "`
	StoreID    int     `json:"StoreID " gorm:"column:StoreID "`
}

type EPhone struct {
	EmployeeID int    `json:"EmployeeID" gorm:"column:EmployeeID"`
	EPhone     string `json:"EPhone" gorm:"column:EPhone"`
}
type EPhoneCreation struct {
	EmployeeID int    `json:"EmployeeID" gorm:"column:EmployeeID"`
	EPhone     string `json:"EPhone" gorm:"column:EPhone"`
}

func (EPhoneCreation) TableName() string { return "ephone" }

type EmployeeCreation struct {
	EmployeeID int     `json:"EmployeeID" gorm:"column:EmployeeID"`
	FirstName  string  `json:"FirstName" gorm:"column:FirstName"`
	Salary     float64 `json:"salary" gorm:"column:salary"`
	LastName   string  `json:"LastName" gorm:"column:LastName"`
	Address    string  `json:"Address" gorm:"column:Address"`
	StoreID    int     `json:"StoreID" gorm:"column:StoreID"`
}

func (EmployeeCreation) TableName() string { return "employee" }

type EmployeeUpdate struct {
	EmployeeID int     `json:"EmployeeID" gorm:"column:EmployeeID"`
	FirstName  string  `json:"FirstName" gorm:"column:FirstName"`
	Salary     float64 `json:"salary" gorm:"column:salary"`
	LastName   string  `json:"LastName" gorm:"column:LastName"`
	Address    string  `json:"Address" gorm:"column:Address"`
	StoreID    int     `json:"StoreID" gorm:"column:StoreID"`
}
