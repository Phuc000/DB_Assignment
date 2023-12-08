package entity

type BillPromotion struct {
	ApplyPrice  int `json:"apply_price" gorm:"apply_price"`
	PromotionID int `json:"promotion_id" gorm:"promotion_id"`
}

type ProductPromotion struct {
	PromotionID int `json:"promotion_id" gorm:"promotion_id"`
}

type PromoteBill struct {
	PromotionID   int `json:"promotion_id" gorm:"promotion_id"`
	TransactionID int `json:"transaction_id" gorm:"transaction_id"`
}
