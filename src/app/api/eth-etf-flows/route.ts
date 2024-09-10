import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get('https://api.coinmarketcap.com/data-api/v3/etf/detail/netflow/list', {
            params: {
                category: 'eth',
                size: 1,
                page: 1
            }
        });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data from CoinMarketCap' }, { status: 500 });
    }
}