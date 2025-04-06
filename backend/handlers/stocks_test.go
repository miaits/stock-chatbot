package handlers

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestLoadStocksFromJSON(t *testing.T) {
	os.Setenv("DATA_FILE", "../data/stock_data.json")
	err := LoadStocksFromJSON()
	if err != nil {
		t.Errorf("Expected ok, got nil %v", err)
	}

	os.Setenv("DATA_FILE", "../data/stock_data_err.json")
	err = LoadStocksFromJSON()
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}

func TestGetStockExchanges(t *testing.T) {
	router := gin.Default()
	router.GET("/stocks/exchanges", GetStockExchanges)

	req, _ := http.NewRequest("GET", "/stocks/exchanges", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Contains(t, response.Body.String(), "LSE")
}

func TestGetStocksByExchange(t *testing.T) {
	router := gin.Default()
	router.GET("/stocks/:exchange", GetStocksByExchange)

	req, _ := http.NewRequest("GET", "/stocks/LSE", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Contains(t, response.Body.String(), "CRDA")
}

func TestGetStockDetails(t *testing.T) {
	router := gin.Default()
	router.GET("/stocks/:exchange/:code", GetStockDetails)

	req, _ := http.NewRequest("GET", "/stocks/LSE/CRDA", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, req)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.Contains(t, response.Body.String(), "CRDA")
}
