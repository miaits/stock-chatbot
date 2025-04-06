package routes

import (
	"lseg-chatbot/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Next()
	})

	router.GET("/stocks/exchanges", handlers.GetStockExchanges)
	router.GET("/stocks/:exchange", handlers.GetStocksByExchange)
	router.GET("/stocks/:exchange/:code", handlers.GetStockDetails)

	return router
}
