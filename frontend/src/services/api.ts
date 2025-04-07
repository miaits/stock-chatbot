import { Exchange, Stock } from '../types/stock';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/stocks';
console.log(API_BASE_URL);

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        if (response.status === 404) {
            throw new ApiError(404, 'Resource not found');
        }
        if (response.status === 500) {
            throw new ApiError(500, 'Internal server error');
        }
        throw new ApiError(response.status, 'An error occurred while fetching data');
    }
    return response.json();
}

export const fetchExchanges = async (): Promise<Exchange> => {
    try {
        const response = await fetch(`${API_BASE_URL}/exchanges`);
        return handleResponse<Exchange>(response);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, 'Network error: Could not connect to the server');
    }
};

export const fetchStocksByExchange = async (exchange: string): Promise<Stock[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${exchange}`);
        return handleResponse<Stock[]>(response);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, 'Network error: Could not connect to the server');
    }
};

export const fetchStockDetails = async (exchange: string, stockCode: string): Promise<Stock> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${exchange}/${stockCode}`);
        return handleResponse<Stock>(response);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, 'Network error: Could not connect to the server');
    }
}; 