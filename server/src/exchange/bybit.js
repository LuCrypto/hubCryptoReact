const { roundMe, fs } = require('../utilitaire/utilitaire.js');

// https://bybit-exchange.github.io/docs/futuresV2/inverse/
class BybitClass {
    constructor() {
        let { SpotClientV3 } = require('bybit-api');

        const _spotClientV3 = new SpotClientV3({
            key: process.env.BYBIT_API_KEY_PUBLIC,
            secret: process.env.BYBIT_API_KEY_PRIVATE,
            baseUrl: 'https://api.bybit.com'
        });

        this.client = _spotClientV3
        this.prefix = '===Bybit | '

        setInterval(() => {
            this.update()
        }, 1000 * process.env.REFRESH_TIME_FOR_EXCHANGE);
    }

    update = async () => {
        console.log(this.prefix + 'UPDATE')

        const [assets, total] = await this.getAssetsAndTotal()
        if (assets === -1 || total === -1) {
            console.log('===Bybit | ERROR : assets === -1 || total === -1');
            return;
        }

        const saveBybitJSON = {
            total: total,
            assets: assets
        }

        await fs.writeFile('./server/src/data/bybit.json', JSON.stringify(saveBybitJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    getAssetsAndTotal = async () => {
        // console.log('this.client : ', this.client);

        let arrayBalances = await this.client.getBalances();
        if (arrayBalances === undefined) {
            console.log('===Bybit | ERROR : arrayBalances === undefined');
            return [-1, -1];
        }

        // display our current timestamp
        console.log('timestamp : ', new Date().toLocaleString());
        console.log('arrayBalances : ', new Date(arrayBalances.time).toLocaleString());
        console.log('arrayBalances : ', arrayBalances.result);
        console.log('arrayBalances : ', arrayBalances.result.balances);

        // Pas bon de faire comme ça pour la somme
        let somme = 0;
        arrayBalances.result.balances.forEach((element) => {
            element.free = parseFloat(element.free);
            element.locked = parseFloat(element.locked);
            element.total = element.free + element.locked;

            console.log('===Bybit | ' + element.coin + ' : ' + element.total);
            somme += parseFloat(element.total);
        });

        console.log('===Bybit | Total : ' + somme);

        return [arrayBalances.result.balances, roundMe(parseFloat(somme), 2)]
    }
}

module.exports = BybitClass;
