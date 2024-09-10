import axios from 'axios';

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
        url: 'https://seeking-alpha.p.rapidapi.com/news/v2/list',
        params: {
            size: '20',
            category: 'market-news::all',
            number: '1'
        },
        headers: {
            'x-rapidapi-key': 'cd2553efacmsh1e91ede7bcbd178p108f7fjsn17ee3fad3996',
            'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const data = response.data.data;

        const recentNews = data.filter((item: any) => {
            const publishOn = new Date(item.attributes.publishOn).getTime() / 1000;
            const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60; // 24 horas atrás en segundos
            return publishOn >= oneDayAgo;
        });

        const processedNews: NewsItem[] = recentNews.map((item: any) => ({
            id: item.id,
            published_on: new Date(item.attributes.publishOn).getTime() / 1000,
            title: item.attributes.title,
            url: item.attributes.url,
            body: item.attributes.content,
            tags: item.attributes.themes.join(', '),
            isRead: false,
            isImportant: false,
            source_info: {
                name: item.attributes.source.name,
            },
        }));

        return {
            status: 200,
            body: JSON.stringify(processedNews),
        };
    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify({ error: 'Error al obtener noticias' }),
        };
    }
}