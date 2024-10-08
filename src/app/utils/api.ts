const axios = require('axios');
import { getQualityRating } from './newsQualityRatings';
// import { htmlToText } from 'html-to-text';

const filterIds = [
    "layer-1",
    "centralized-exchange-token-cex",
    "decentralized-finance-defi",
    "meme-token",
    "artificial-intelligence",
    "infrastructure",
    "layer-2",
    "depin",
    "gaming",
    "decentralized-exchange",
    "zero-knowledge-zk",
    "real-world-assets-rwa",
    "layer-0-l0",
    "gmci-30-index",
    "play-to-earn",
    "metaverse",
    "socialfi",
    "wallets"
];

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
export const sectorPerformance = async () => {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/categories");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Filtrar solo los elementos que coincidan con los ids especificados
    const filteredData = data.filter((item: { id: string; }) => filterIds.includes(item.id));

    return filteredData;
}

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

export const fetchCryptoNews = async (startTimestamp: number, endTimestamp: number) => {
    let currentTimestamp = endTimestamp;
    let responses: any[] = [];

    try {
        while (currentTimestamp > startTimestamp) {
            const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/news/?lTs=${currentTimestamp}`);
            // console.log("Api call");
            // Filter out news items that are older than the start timestamp
            const filteredData = response.data.Data.filter((item: any) => item.published_on >= startTimestamp)
                .map((item: any) => ({
                    ...item,
                    quality: getQualityRating(item.source_info.name)
                }));

            // Get the oldest timestamp from the current batch
            const oldestTimestamp = filteredData[filteredData.length - 1]?.published_on;

            // Update the currentTimestamp for the next iteration
            currentTimestamp = oldestTimestamp ? oldestTimestamp - 1 : startTimestamp;

            responses = [...responses, ...filteredData];
        }

        // console.log(`Total news items fetched: ${responses.length}`);
        return responses;
    } catch (error) {
        console.error("Error fetching crypto news:", error);
        return [];
    }
};

export const fetchBTCETFFlows = async () => {
    const response = await fetch('../api/btc-etf-flows');
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data; // Asumiendo que la estructura de los datos se mantiene igual
};

export const fetchETHETFFlows = async () => {
    const response = await fetch('../api/eth-etf-flows');
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data; // Asumiendo que la estructura de los datos se mantiene igual
};

interface NewsItem {
    id: string;
    published_on: number;
    title: string;
    url: string;
    body: string;
    tags: string;
    isRead: boolean;
    isImportant: boolean;
    source_info: {
        name: string;
    };
}

export const fetchFinancialNews = async () => {
    const url = 'https://seeking-alpha.p.rapidapi.com/news/v2/list?size=20&category=market-news%3A%3Aall&number=1';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'cd2553efacmsh1e91ede7bcbd178p108f7fjsn17ee3fad3996',
            'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const rawData = await response.json();
        const data = rawData.data;

        const recentNews = data.filter((item: any) => {
            const publishOn = new Date(item.attributes.publishOn).getTime() / 1000;
            const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60; // 24 horas atrás en segundos
            return publishOn >= oneDayAgo;
        });

        // Función para limpiar HTML
        const processHTML = (htmlString: string) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            return doc.body.innerText || ""; // Retornamos solo el texto, limpiando el HTML
        };

        const processedNews: NewsItem[] = recentNews.map((item: any) => ({
            id: item.id,
            published_on: new Date(item.attributes.publishOn).getTime() / 1000,
            title: item.attributes.title,
            url: item.attributes.url,
            body: processHTML(item.attributes.body || ''), // Limpiamos el HTML
            tags: "no show",
            isRead: false,
            isImportant: false,
            source_info: {
                name: item.links.canonical,
            },
        }));

        return processedNews;
    } catch (error) {
        console.error(error);
    }
};



// export const fetchETHETFFlows = async () => {
//     try {
//         const response = await fetch('https://api.coinmarketcap.com/data-api/v3/etf/detail/netflow/list?category=eth&size=1&page=1');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching ETH ETF flows:", error);
//         return {};
//     }
// };