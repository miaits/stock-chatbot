package models

type Stock struct {
	Code  string  `json:"code"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type StockExchange struct {
	Code      string  `json:"code"`
	Name      string  `json:"name"`
	TopStocks []Stock `json:"topStocks"`
}

type StockExchangeList struct {
	StockExchanges []StockExchange `json:"stockExchanges"`
}
