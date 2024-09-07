const axios = require('axios');

export const fetchTopMoversOne = async () => {
    const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=1"
    );
    const data = await response.json();
    const allData = data.flat();
    return await allData;
};

export const fetchTopMoversThree = async () => {
    try {
        const responses = await Promise.all([
            fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=1"),
            fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=2"),
            fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=3"),
        ]);

        // Parsear las respuestas a JSON
        const data = await Promise.all(responses.map(response => response.json()));

        // Combinar todos los arrays de resultados en uno solo
        const allData = data.flat();

        // Retornar los datos combinados
        return allData;
    } catch (error) {
        console.error("Error fetching top movers:", error);
        return []; // Retornar un array vacío en caso de error
    }
};

export const fetchMarketcap = async () => {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    return await response.json();
};

export const fetchFearAndGreed = async () => {
    const response = await fetch("https://api.alternative.me/fng/");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
};


export const fetchCMCData = async () => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories', {
            headers: {
                'X-CMC_PRO_API_KEY': '584ad864-a952-49b1-85bb-2e49e1240084', // Reemplaza con tu API Key
            },
        });

        // Los datos ya vienen en formato JSON
        return response.data;
    } catch (error) {
        console.error("Error fetching CoinMarketCap data:", error);
        return {}; // Retornar un objeto vacío en caso de error
    }
};

export const fetchCryptoNews = async () => {
    try {
        const response = await axios.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        return response.data.Data; // Devuelve solo el array de noticias
    } catch (error) {
        console.error("Error fetching crypto news:", error);
        return []; // Devuelve un array vacío en caso de error
    }
};