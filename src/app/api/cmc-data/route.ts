// src/app/api/cmc-data/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
    try { /// id: "65f23191e6c934565751ce16"
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories', {
            // params: {
            //     id: "65f23191e6c934565751ce16", // ID de la categoría que estás buscando
            //     // Puedes agregar otros parámetros aquí si es necesario
            //     limit: 3
            // },
            headers: {
                'X-CMC_PRO_API_KEY': '584ad864-a952-49b1-85bb-2e49e1240084', // Reemplaza con tu API Key
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching CoinMarketCap data:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
