const BinanceClass = require('./src/binance');
const KucoinClass = require('./src/kucoin');
const { bybit } = require('./src/bybit');
const { tronlink } = require('./src/tronlink');
const aptos = require('./src/aptos');
const { polygon } = require('./src/polygon');
const { ethereum } = require('./src/ethereum');
const { binanceSmartChain } = require('./src/binanceSmartChain');
const { roundMe } = require('./src/utilitaire');
// const { cosmos } = require('./src/cosmos');

// Donnees exchanges cache
let valueExchange = null;

// Server setup
const express = require("express");
const path = require("path");
const { time } = require('console');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static("client/build"));

app.get("/exchanges", async (_, res) => {
    console.log('/exchanges CALL');
    let exchangesValue = [
        {
            name: "binance",
            total: 123,
            assets: []
        },
        {
            name: "kucoin",
            total: 123,
            assets: []
        },
        {
            name: "bybit",
            total: 123,
            assets: []
        }
    ]

    // On récupère les données qu'une fois
    if (valueExchange === null) {
        console.log('API take data');
        valueExchange = await dataExchange()
        console.log('valueExchange', valueExchange)
    } else {
        console.log('ALREADY DATA')
    }

    let finalValue = {
        exchanges: valueExchange,
        defi: {}
    }

    res.json(finalValue);
});

app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Function 
const dataExchange = async () => {
    // EXCHANGE
    // ==================================
    const instanceBinance = new BinanceClass()

    console.log(instanceBinance.sommeWalletSpotBinance())
    // const totalBinance = instanceBinance.binanceWallet()

    return

    const instanceKucoin = new KucoinClass()
    const totalKucoin = instanceKucoin.kucoinWallet()

    const totalBybit = bybit()

    const arrayData = [totalBinance, totalKucoin, totalBybit]
    return Promise.all(arrayData).then((values) => {
        console.log('values', values)

        const myReturn = [
            values[0],
            {
                name: "kucoin",
                total: roundMe(values[1]),
                assets: []
            },
            {
                name: "bybit",
                total: roundMe(values[2]),
                assets: []
            }
        ]

        return myReturn
    })
}

dataExchange()

const dataDecentralize = async () => {
    // DEFI
    // ==================================
    // aptos();

    const web3 = require('web3');

    const polygonValue = polygon(web3);

    const ethereumValue = ethereum(web3);

    // binanceSmartChain(web3)

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



// dataDecentralize()
