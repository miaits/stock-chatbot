import React, { useState, useEffect } from 'react';
import { Exchange, Stock } from '../types/stock';
import { fetchExchanges, fetchStocksByExchange } from '../services/api';
import './StockExchange.css';

const StockExchange: React.FC = () => {
    const [exchanges, setExchanges] = useState<Exchange>({});
    const [selectedExchange, setSelectedExchange] = useState<string>('');
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExchanges = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchExchanges();
                setExchanges(data);
            } catch (error: any) {
                setError('Unable to load stock exchange data. Please try again later.');
                setExchanges({});
            } finally {
                setLoading(false);
            }
        };
        loadExchanges();
    }, []);

    useEffect(() => {
        const loadStocks = async () => {
            if (!selectedExchange) return;
            
            try {
                setLoading(true);
                setError(null);
                const data = await fetchStocksByExchange(selectedExchange);
                setStocks(data);
            } catch (error: any) {
                setError('Unable to load stocks. Please try again later.');
                setStocks([]);
            } finally {
                setLoading(false);
            }
        };
        loadStocks();
    }, [selectedExchange, exchanges]);

    if (error) {
        return (
            <div className="stock-exchange-container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="stock-exchange-container">
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading stock information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-exchange-container">
            <h1>Stock Exchanges</h1>
            <div className="exchanges-row">
                {Object.entries(exchanges).map(([code, name]) => (
                    <button
                        key={code}
                        className={`exchange-button ${selectedExchange === code ? 'active' : ''}`}
                        onClick={() => setSelectedExchange(code)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            {selectedExchange && (
                <div className="stocks-container">
                    <h2>{exchanges[selectedExchange]} Stocks</h2>
                    {stocks.length > 0 ? (
                        <div className="stocks-grid">
                            {stocks.map((stock) => (
                                <div key={stock.code} className="stock-card">
                                    <h3>{stock.stockName}</h3>
                                    <p className="stock-code">{stock.code}</p>
                                    <p className="stock-price">£{stock.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-stocks-message">No stocks available for this exchange.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StockExchange; 