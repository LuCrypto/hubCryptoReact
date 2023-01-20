const PolygonClass = require('./polygon');
const EthereumClass = require('./ethereum');
const BinanceSmartChainClass = require('./binanceSmartChain');
const { tronlink } = require('./tronlink');
const aptos = require('./aptos');
const { roundMe, fs } = require('./utilitaire');
// const { cosmos } = require('./cosmos');

// Init data defi in json files
const initDataDefi = async () => {
    // DEFI
    // ==================================
    // aptos();

    const web3 = require('web3');

    const instanceBinane = new BinanceSmartChainClass(web3);
    await instanceBinane.update()

    return
    const instanceEthereum = new EthereumClass(web3);
    await instanceEthereum.update()

    const polygonInstance = new PolygonClass(web3);
    await polygonInstance.update()




    // tronlink()

    // Cosmos (Atom) : don't work
    // cosmos()

    const arrayData = [polygonValue, ethereumValue]
    return Promise.all(arrayData).then((values) => {
        console.log('values', values)
        const myReturn = {
            polygon: values[0],
            ethereum: values[1]

        }

        return myReturn
    })
}

// Read data defi in json files
const readDataDefi = () => {
    const arrayExchange = ['aptos', 'bsc', 'ethereum', 'polygon', 'tronlink']

    const arrayData = arrayExchange.map(async (exchange) => {
        const json = JSON.parse(await fs.readFile(`./server/src/data/${exchange}.json`, 'utf8'));

        return {
            name: exchange,
            json: json
        }
    })

    return Promise.all(arrayData).then((values) => {
        // console.log('values', values)
        return values
    })
}

module.exports = {
    initDataDefi,
    readDataDefi
}