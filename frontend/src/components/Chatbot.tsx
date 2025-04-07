import React, { useState, useEffect, useRef } from 'react';
import { Exchange, Stock, ChatMessage } from '../types/stock';
import { fetchExchanges, fetchStocksByExchange, fetchStockDetails } from '../services/api';
import './Chatbot.css';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [exchanges, setExchanges] = useState<Exchange>({});
    const [selectedExchange, setSelectedExchange] = useState<string>('');
    const [currentStocks, setCurrentStocks] = useState<Stock[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const exchangesData = await fetchExchanges();
                setExchanges(exchangesData);
                const exchangeButtons = Object.entries(exchangesData).map(([code, name]) => ({
                    code,
                    stockName: name,
                    price: 0
                }));
                
                setMessages([
                    {
                        type: 'bot',
                        content: 'Hello! I can help you explore stock exchanges. Here are the available exchanges:',
                        timestamp: new Date(),
                        data: exchangeButtons
                    }
                ]);
            } catch (error) {
                setMessages([
                    {
                        type: 'bot',
                        content: 'Sorry, I could not connect to the server. Please try again later.',
                        timestamp: new Date()
                    }
                ]);
            }
        };
        if (isOpen) {
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getErrorMessage = (error: any) => {
        if (error?.name === 'ApiError') {
            switch (error.status) {
                case 404:
                    return 'The requested information was not found. Please check if the exchange or stock code is correct.';
                case 500:
                    return 'There was a problem with the server. Please try again later.';
                default:
                    return 'An error occurred while fetching the data. Please try again.';
            }
        }
        return 'Could not connect to the server. Please check your internet connection and try again.';
    };

    const handleExchangeSelect = async (exchange: string) => {
        setSelectedExchange(exchange);
        try {
            const stocksData = await fetchStocksByExchange(exchange);
            const top5Stocks = stocksData.slice(0, 5);
            setCurrentStocks(top5Stocks);
            
            if (top5Stocks.length === 0) {
                setMessages(prev => [...prev, 
                    {
                        type: 'user',
                        content: `Show me stocks from ${exchanges[exchange]}`,
                        timestamp: new Date()
                    },
                    {
                        type: 'bot',
                        content: `No stocks found for ${exchanges[exchange]}. Please try another exchange.`,
                        timestamp: new Date(),
                        data: [{
                            code: 'markets',
                            stockName: 'Back to markets',
                            price: 0
                        }]
                    }
                ]);
                return;
            }

            setMessages(prev => [...prev, 
                {
                    type: 'user',
                    content: `Show me stocks from ${exchanges[exchange]}`,
                    timestamp: new Date()
                },
                {
                    type: 'bot',
                    content: `Here are the top 5 stocks on ${exchanges[exchange]}. Click on any code to see more details:`,
                    timestamp: new Date(),
                    data: [
                        ...top5Stocks.map(stock => ({
                            ...stock,
                            stockName: stock.code
                        })),
                        {
                            code: 'markets',
                            stockName: 'Back to markets',
                            price: 0
                        }
                    ]
                }
            ]);
        } catch (error) {
            setMessages(prev => [...prev,
                {
                    type: 'user',
                    content: `Show me stocks from ${exchanges[exchange]}`,
                    timestamp: new Date()
                },
                {
                    type: 'bot',
                    content: getErrorMessage(error),
                    timestamp: new Date(),
                    data: [{
                        code: 'markets',
                        stockName: 'Back to markets',
                        price: 0
                    }]
                }
            ]);
        }
    };

    const handleStockSelect = async (stock: Stock) => {
        try {
            const stockDetails = await fetchStockDetails(selectedExchange, stock.code);
            setMessages(prev => [...prev,
                {
                    type: 'user',
                    content: `Show me details for ${stock.code}`,
                    timestamp: new Date()
                },
                {
                    type: 'bot',
                    content: `${stockDetails.stockName} (${stockDetails.code}) is currently trading at £${stockDetails.price.toFixed(2)}`,
                    timestamp: new Date(),
                    data: [
                        {
                            code: 'back',
                            stockName: 'Back to stocks list',
                            price: 0
                        },
                        {
                            code: 'markets',
                            stockName: 'Back to markets',
                            price: 0
                        }
                    ]
                }
            ]);
        } catch (error) {
            setMessages(prev => [...prev,
                {
                    type: 'user',
                    content: `Show me details for ${stock.code}`,
                    timestamp: new Date()
                },
                {
                    type: 'bot',
                    content: getErrorMessage(error),
                    timestamp: new Date(),
                    data: [{
                        code: 'markets',
                        stockName: 'Back to markets',
                        price: 0
                    }]
                }
            ]);
        }
    };

    const handleBackToStocks = () => {
        setMessages(prev => [...prev,
            {
                type: 'user',
                content: 'Back to stocks list',
                timestamp: new Date()
            },
            {
                type: 'bot',
                content: `Here are the top 5 stocks on ${exchanges[selectedExchange]}. Click on any code to see more details:`,
                timestamp: new Date(),
                data: [
                    ...currentStocks.map(stock => ({
                        ...stock,
                        stockName: stock.code
                    })),
                    {
                        code: 'markets',
                        stockName: 'Back to markets',
                        price: 0
                    }
                ]
            }
        ]);
    };

    const handleBackToMarkets = () => {
        setSelectedExchange('');
        setCurrentStocks([]);
        const exchangeButtons = Object.entries(exchanges).map(([code, name]) => ({
            code,
            stockName: name,
            price: 0
        }));
        
        setMessages(prev => [...prev,
            {
                type: 'user',
                content: 'Back to markets',
                timestamp: new Date()
            },
            {
                type: 'bot',
                content: 'Here are the available exchanges:',
                timestamp: new Date(),
                data: exchangeButtons
            }
        ]);
    };

    return (
        <>
            <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
                🤖
            </button>
            {isOpen && (
                <div className="chat-container">
                    <div className="chat-header">
                        <h3>Stock Exchange Assistant</h3>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                <div className="message-content">{message.content}</div>
                                {message.data && (
                                    <div className="message-data">
                                        {message.data.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className="data-button"
                                                onClick={() => {
                                                    if (item.code === 'back') {
                                                        handleBackToStocks();
                                                    } else if (item.code === 'markets') {
                                                        handleBackToMarkets();
                                                    } else if (item.price === 0) {
                                                        handleExchangeSelect(item.code);
                                                    } else {
                                                        handleStockSelect(item);
                                                    }
                                                }}
                                            >
                                                {item.price === 0 ? item.stockName : item.code}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot; 