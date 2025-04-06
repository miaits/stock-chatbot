package main

import (
	"lseg-chatbot/handlers"
	"lseg-chatbot/routes"
)

func main() {
	handlers.LoadStocks()
	router := routes.SetupRouter()
	router.Run(":8080")
}
