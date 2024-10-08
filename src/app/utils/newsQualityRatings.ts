export const newsQualityRatings: Record<string, number> = {
    "Bitcoinist": 1,
    "CryptoInsider": 1,
    "Crypto Watch": 1,
    "CoinJoker": 1,
    "ETHNews.com": 1,
    "CoinTurk": 1,
    "Coinnounce": 1,
    "Coin Academy": 1,
    "The Coin Rise": 1,
    "Chainwire": 1,
    "Cryptoknowmics": 1,
    "CryptoIntelligence": 1,
    "CoinTurk News": 1,
    "Crypto CoreMedia": 2,
    "Bitcoinerx": 2,
    "CCN": 2,
    "CryptoVest": 2,
    "EspacioBit": 2,
    "Cryptopolitan": 2,
    "ZyCrypto": 2,
    "NullTx": 2,
    "TimesTabloid": 2,
    "The News Crypto": 2,
    "Bitcoin World": 2,
    "CryptoNewsZ": 2,
    "Journal Du Coin": 2,
    "Chaindd": 2,
    "CryptoGlobe": 3,
    "Crypto Potato": 3,
    "Coinpedia": 3,
    "Cointelligence": 3,
    "OKX Insights": 3,
    "AMB Crypto": 3,
    "CoinSpeaker": 3,
    "CriptoNoticias": 3,
    "Weiss Crypto Ratings": 3,
    "Finance Magnates": 3,
    "Cryptonaute": 3,
    "The Coin Republic": 3,
    "CryptoNewsReview": 3,
    "Chaintimes": 3,
    "CryptoCoin.News": 3,
    "Huobi blog": 3,
    "CoinOtag": 3,
    "NFT News": 3,
    "The Crypto Basic": 3,
    "CryptoNews": 3,
    "Coincu": 3,
    "Coinpaper": 3,
    "Bitfinex blog": 3,
    "Blokt": 3,
    "Cryptonewsfr": 3,
    "CCData": 3,
    "BitcoinSistemi": 3,
    "Finbold": 3,
    "Coinpaprika": 3,
    "CryptoCompare": 3,
    "Crypto Daily": 3,
    "Cryptoast": 3,
    "BitDegree": 3,
    "BTC Pulse": 3,
    "Coin Edition": 3,
    "TimesNext": 3,
    "Ethereum World News": 3,
    "Vauld Insights": 3,
    "Cryptonomist": 3,
    "Daily Coin": 3,
    "99bitcoins": 3,
    "CoinGape": 4,
    "Blockworks": 4,
    "The Daily Hodl": 4,
    "CryptoSlate": 4,
    "Crypto Briefing": 4,
    "Bitcoin.com": 4,
    "NewsBTC": 4,
    "U.Today": 4,
    "CoinTelegraph (FR)": 4,
    "TipRanks": 4,
    "Seeking Alpha": 4,
    "DiarioBitcoin": 4,
    "Kraken Blog": 4,
    "BeInCrypto": 4,
    "TrustNodes": 4,
    "CoinTelegraph (ES)": 4,
    "The Defiant": 4,
    "Invezz": 4,
    "Yahoo Finance Bitcoin": 4,
    "CoinDesk": 5,
    "CoinTelegraph": 5,
    "Bitcoin Magazine": 5,
    "Decrypt": 5,
    "TheBlock": 5,
    "Financial Times (Crypto)": 5,
    "Forbes Digital Assets": 5,
    "Bloomberg (Crypto)": 5,
    // Agrega más fuentes y sus calificaciones aquí
};

export const getQualityRating = (sourceName: string): number => {
    return newsQualityRatings[sourceName] || 0; // Devuelve 0 como calificación por defecto si no se encuentra la fuente
};