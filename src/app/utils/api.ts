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

/*
export const fetchDailyCashFlow = async (ticker: string) => {
    const baseUrl = "https://www.alphavantage.co/query";
    const function_ = "CASH_FLOW";
    const apiKey = "LWUY26WXHHTJIFK5"
    const url = `${baseUrl}?function=${function_}&symbol=${ticker}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        if ("quarterlyReports" in data) {
            const quarterlyReports = data.quarterlyReports;
            
            // Calcular el flujo de caja diario
            const dailyCashFlows = quarterlyReports.map((report: any, index: number, array: any[]) => {
                const endDate = new Date(report.fiscalDateEnding);
                const startDate = index < array.length - 1 
                    ? new Date(array[index + 1].fiscalDateEnding)
                    : new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const dailyCashFlow = parseFloat(report.operatingCashflow) / days;
                
                return {
                    fiscalDateEnding: report.fiscalDateEnding,
                    operatingCashflow: parseFloat(report.operatingCashflow),
                    dailyCashFlow: dailyCashFlow
                };
            });
            
            return dailyCashFlows;
        } else {
            console.error(`No se encontraron datos para ${ticker}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
};
*/