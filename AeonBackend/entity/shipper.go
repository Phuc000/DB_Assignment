package entity

type Shipper struct {
	ShipperID       int    `json:"ShipperID" gorm:"column:ShipperID"`
	VehicleCapacity int    `json:"VehicleCapacity" gorm:"column:VehicleCapacity"`
	Area            string `json:"Area" gorm:"column:Area"`
	Status          string `json:"Status" gorm:"column:Status"`
	SAddress        string `json:"SAddress" gorm:"column:SAddress"`
	SFName          string `json:"SFName" gorm:"column:SFName"`
	SLName          string `json:"SLName" gorm:"column:SLName"`
}

type ShipperPhoneNo struct {
	ShipperID int    `json:"ShipperID" gorm:"column:ShipperID"`
	PhoneNo   string `json:"PhoneNo" gorm:"column:PhoneNo"`
}

type ShippePhoneNoCreation struct {
	ShipperID int    `json:"ShipperID" gorm:"column:ShipperID"`
	PhoneNo   string `json:"PhoneNo" gorm:"column:PhoneNo"`
}

func (ShippePhoneNoCreation) TableName() string { return "shipper_phone_no" }

type ShipperCreation struct {
	ShipperID       int    `json:"ShipperID" gorm:"column:ShipperID"`
	VehicleCapacity int    `json:"VehicleCapacity" gorm:"column:VehicleCapacity"`
	Area            string `json:"Area" gorm:"column:Area"`
	Status          string `json:"Status" gorm:"column:Status"`
	SAddress        string `json:"SAddress" gorm:"column:SAddress"`
	SFName          string `json:"SFName" gorm:"column:SFName"`
	SLName          string `json:"SLName" gorm:"column:SLName"`
}

func (ShipperCreation) TableName() string { return "shipper" }

type AreaShip struct {
	ShipperID int    `json:"ShipperID" gorm:"column:ShipperID"`
	Area      string `json:"Area" gorm:"column:Area"`
}
