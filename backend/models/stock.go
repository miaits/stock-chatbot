package models

type Stock struct {
	Code      string  `json:"code"`
	StockName string  `json:"stockName"`
	Price     float64 `json:"price"`
}

type StockExchange struct {
	Code          string  `json:"code"`
	StockExchange string  `json:"stockExchange"`
	TopStocks     []Stock `json:"topStocks"`
}
