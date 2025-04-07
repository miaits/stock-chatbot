export interface Exchange {
    [key: string]: string;
}

export interface Stock {
    code: string;
    stockName: string;
    price: number;
}

export interface ChatMessage {
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
    data?: Stock[];
} 