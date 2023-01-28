const CoinMarketCap = require('coinmarketcap-api')
const { fs } = require('./utilitaire.js');

class CoinMarketCapClass {
    constructor() {
        this.apiKey = process.env.COINMARKETCAP_API_KEY_PUBLIC
        this.client = new CoinMarketCap(this.apiKey)

        console.log('canne a peche');

        // Update data every hour
        setInterval(() => {
            this.updateData()
        }, 1000 * process.env.REFRESH_TIME_FOR_GENERAL_DATA)
    }

    async updateData() {
        // On getTickets get only the attributes we need : id, name, symbol, slug, quote
        let allCrypto = await this.client.getTickers({
            limit: 3000,
            convert: 'USD'
        })

        // get all id token with name and symbol since the beginning
        // this.client.getIdMap().then(console.log).catch(console.error)

        // Get only interesting data
        allCrypto = allCrypto.data.map((crypto) => {
            return {
                rank: crypto.cmc_rank,
                name: crypto.name,
                symbol: crypto.symbol,
                advanced: {
                    circulating_supply: crypto.circulating_supply,
                    total_supply: crypto.total_supply,
                    max_supply: crypto.max_supply,
                    platform: crypto.platform,
                },
                quote: crypto.quote
            }
        })

        // convert allCrypto to a object with key = symbol
        allCrypto = allCrypto.reduce((obj, item) => {
            obj[item.symbol.toUpperCase()] = item;
            return obj;
        }, {});

        await fs.writeFile('./server/src/data/allCrypto.json', JSON.stringify(allCrypto), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });

    }
}

module.exports = CoinMarketCapClass







