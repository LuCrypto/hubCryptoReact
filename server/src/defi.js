const PolygonClass = require('./defi/polygon');
const EthereumClass = require('./defi/ethereum');
const bscClass = require('./defi/bsc');
const TronlinkClass = require('./defi/tronlink');
const AptosClass = require('./defi/aptos');
const { roundMe, fs } = require('./utilitaire/utilitaire');
// const { cosmos } = require('./cosmos');

// Init data defi in json files
const initDataDefi = async () => {
    // DEFI
    // ==================================

    const web3 = require('web3');

    const dataPriceCrypto = JSON.parse(await fs.readFile(`./server/src/data/allCrypto.json`, 'utf8'));

    const instanceBinance = new bscClass(web3, dataPriceCrypto);
    const promesseBinance = instanceBinance.update()

    const aptosInstance = new AptosClass(dataPriceCrypto);
    const promesseAptos = aptosInstance.update()

    // const instanceTronlink = new TronlinkClass(dataPriceCrypto);
    // const promesseTronlink = instanceTronlink.update()

    const instanceEthereum = new EthereumClass(web3, dataPriceCrypto);
    const promesseEthereum = instanceEthereum.update()

    const polygonInstance = new PolygonClass(web3, dataPriceCrypto);
    const promessePolygon = polygonInstance.update()

    // Cosmos (Atom) : don't work
    // cosmos()

    const arrayData = [promesseAptos, promesseBinance, promesseEthereum, promessePolygon]
    return Promise.all(arrayData).then((values) => {
        return readDataDefi()
    })
}

// Read data defi in json files
const readDataDefi = () => {
    const arrayDefi = ['aptos', 'bsc', 'ethereum', 'polygon', 'tronlink']

    const arrayData = arrayDefi.map(async (defi) => {
        const json = JSON.parse(await fs.readFile(`./server/src/data/${defi}.json`, 'utf8'));

        return {
            name: defi,
            json: json
        }
    })

    return Promise.all(arrayData).then((values) => {
        console.log('FINAL VALUES : ', values)

        fs.writeFile('./server/src/data/finalValues.json', JSON.stringify(values), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });

        return values
    })
}

module.exports = {
    initDataDefi,
    readDataDefi
}