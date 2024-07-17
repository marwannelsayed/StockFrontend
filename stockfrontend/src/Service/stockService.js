import axios from 'axios';
import * as signalR from '@microsoft/signalr';

let connection = null;

export const startConnection = async (onStockUpdate) => {
    const token = localStorage.getItem('jwtToken');

    connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5191/stockHub', { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

    connection.on('ReceiveStockUpdate', onStockUpdate);

    try {
        await connection.start();
        console.log('SignalR Connected.');
    } catch (error) {
        console.error('SignalR Connection Error: ', error);
    }
};

export const stopConnection = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log('SignalR Disconnected.');
        } catch (error) {
            console.error('SignalR Disconnection Error: ', error);
        }
    }
};

export const fetchInitialStocks = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get('http://localhost:5191/StockExchange/api/stocks', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching initial stocks:", error);
        return [];
    }
};

export const subscribeToStock = async (stockSymbol) => {
    const url = `http://localhost:5191/StockExchange/api/subscribe?stockSymbol=${stockSymbol}`;
    const token = localStorage.getItem('jwtToken');
    try {
        console.log('Subscribing to stock:', stockSymbol);
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Stock subscribed successfully:', response.data);
        // Optionally, handle success (e.g., update UI or show a success message)
    } catch (error) {
        console.error('Error subscribing to stock:', error);
        // Handle specific errors, such as displaying an error message to the user
        return [];
    }
};

export const buyStock = async (stockSymbol, quantity, price) => {
    const url = `http://localhost:5191/StockExchange/api/stocks/${stockSymbol}/buy/${quantity}?price=${price}`;
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        throw new Error('No JWT token found. User is not authenticated.');
    }

    try {
        console.log('Buying stock:', stockSymbol, 'Quantity:', quantity, 'Price:', price);
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Stock bought successfully:', response.data);
        return response.data; // Ensure this contains the bought stock data
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        throw error;
    }
};



export const fetchBoughtStocks = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get('http://localhost:5191/StockExchange/api/stocks/boughtstocks', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching bought stocks:", error);
        return [];
    }
}



