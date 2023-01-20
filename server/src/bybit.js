const { roundMe, fs } = require('./utilitaire.js');

class BybitClass {
    constructor() {
        let { SpotClientV3 } = require('bybit-api');

        const _spotClientV3 = new SpotClientV3({
            key: 'YpGigoVY2VAaBZ8546',
            secret: 'VsC3hiqiMccBJTTOU7ILvNAPTNgkfSbVLMLD'
        });

        this.client = _spotClientV3
        this.prefix = '===Bybit | '

        setInterval(() => {
            this.update()
        }, 1000 * 60);
    }

    update = async () => {
        console.log(this.prefix + 'UPDATE')

        const [assets, total] = await this.getAssetsAndTotal()

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
