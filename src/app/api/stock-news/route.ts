import { NextResponse } from 'next/server';
import axios from 'axios';

interface RapidAPINewsItem {
    article_title: string;
    article_url: string;
    article_photo_url: string;
    source: string;
    post_time_utc: string;
}

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

export async function GET() {
    const options = {
        method: 'GET',
        url: 'https://real-time-finance-data.p.rapidapi.com/stock-news',
        params: {
            symbol: 'AAPL:NASDAQ',
            language: 'en'
        },
        headers: {
            'x-rapidapi-key': 'cd2553efacmsh1e91ede7bcbd178p108f7fjsn17ee3fad3996',
            'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const rawNews: RapidAPINewsItem[] = response.data.data.news;

        const recentNews = rawNews.filter((item) => {
            const publishedOn = new Date(item.post_time_utc).getTime() / 1000;
            const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60; // 24 hours ago in seconds
            return publishedOn >= oneDayAgo;
        });

        const processedNews: NewsItem[] = recentNews.map((item, index) => ({
            id: `rapid-${index}`,
            published_on: new Date(item.post_time_utc).getTime() / 1000,
            title: item.article_title,
            url: item.article_url,
            body: "Body not provided by this API", // RapidAPI doesn't provide article body
            tags: "AAPL", // Using the stock symbol as a tag
            isRead: false,
            isImportant: false,
            source_info: {
                name: item.source
            }
        }));

        return NextResponse.json(processedNews);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}