package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"lseg-chatbot/models"

	"github.com/gin-gonic/gin"
)

var stockData []models.StockExchange

func LoadStocks() {
	err := LoadStocksFromJSON()
	if err != nil {
		LoadStocksFromYahoo()
	}
}

func GetStockExchanges(c *gin.Context) {
	response := make(map[string]string)
	for _, stockExchange := range stockData {
		response[stockExchange.Code] = stockExchange.StockExchange
	}
	if len(response) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No stock exchanges found"})
		return
	}
	c.JSON(http.StatusOK, response)
}

func GetStocksByExchange(c *gin.Context) {
	exchange := c.Param("exchange")
	for _, stockExchange := range stockData {
		if stockExchange.Code == exchange {
			c.JSON(http.StatusOK, stockExchange.TopStocks)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Exchange not found"})
}

func GetStockDetails(c *gin.Context) {
	exchange := c.Param("exchange")
	code := c.Param("code")
	for _, stockExchange := range stockData {
		if stockExchange.Code == exchange {
			for _, stock := range stockExchange.TopStocks {
				if stock.Code == code {
					c.JSON(http.StatusOK, stock)
					return
				}
			}
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Stock not found"})
}

func LoadStocksFromJSON() error {
	dataFile := os.Getenv("DATA_FILE")
	if dataFile == "" {
		log.Println("DATA_FILE is not set")
		return fmt.Errorf("DATA_FILE is not set")
	}
	jsonFile, err := os.Open(dataFile)
	if err != nil {
		return fmt.Errorf("failed to open JSON file: %w", err)
	}
	defer jsonFile.Close()

	jsonData, err := io.ReadAll(jsonFile)
	if err != nil {
		return fmt.Errorf("failed to read JSON file: %w", err)
	}

	err = json.Unmarshal(jsonData, &stockData)
	if err != nil {
		return fmt.Errorf("failed to unmarshal JSON data: %w", err)
	}

	return nil
}

func LoadStocksFromYahoo() error {
	fmt.Println("Loading stocks from Yahoo")
	return nil
}
