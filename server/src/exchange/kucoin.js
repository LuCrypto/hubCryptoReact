const { roundMe, fs } = require('../utilitaire/utilitaire.js');

// Kucoin
class KucoinClass {
    constructor() {
        const _config = {
            apiKey: process.env.KUCOIN_API_KEY_PUBLIC,
            secretKey: process.env.KUCOIN_API_KEY_PRIVATE,
            passphrase: process.env.KUCOIN_PASSPHRASE,
            environment: 'live'
        }

        this.kucoinApi = require('kucoin-node-api')
        this.kucoinApi.init(_config)
        this.prefix = '===Kucoin | '

        setInterval(() => {
            this.update()
        }, 1000 * process.env.REFRESH_TIME_FOR_EXCHANGE);
    }

    update = async () => {
        console.log(this.prefix + 'UPDATE')

        const [assetKucoin, total] = await this.kucoinWallet()
        console.log(assetKucoin)

        const saveKucoinJSON = {
            total: total,
            assets: assetKucoin
        }

        await fs.writeFile('./server/src/data/kucoin.json', JSON.stringify(saveKucoinJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    // Get fiat price currencies
    // Take an array of string crypto currencies and return an array of object with the price in USD
    getFiatCurrencies = async (arrayCurrencies) => {
        let params = {
            base: 'USD',
            currencies: arrayCurrencies
        }

        try {
            let r = await this.kucoinApi.getFiatPrice(params)
            console.log(r.data)
            return r.data
        }
        catch (error) {
            console.log(error)
            return -1
        }
    }

    // Get all my balances in my account
    getBalanceAccounts = async () => {
        let arrayWalletUserMain = []
        let arrayWalletUserTrade = []

        try {
            let r = await this.kucoinApi.getAccounts()

            r.data.map((element) => {
                if (element.balance != 0) {
                    if (element.type == 'main')
                        arrayWalletUserMain.push({
                            asset: element.currency,
                            amount: element.balance,
                            type: element.type
                        })
                    else
                        arrayWalletUserTrade.push({
                            asset: element.currency,
                            amount: element.balance,
                            type: element.type
                        })
                }
            })

            return { arrayWalletUserMain, arrayWalletUserTrade }
        } catch (error) {
            console.log(error)
            return -1
        }
    }

    // Get wallet balance of kucoin with fiat price of each crypto currency
    kucoinWallet = async () => {
        let arrayFinal = []
        const { arrayWalletUserMain, arrayWalletUserTrade } = await this.getBalanceAccounts()
        if (arrayWalletUserMain == -1)
            return -1
        const arrayWalletUserMainFiat = await this.getFiatCurrencies(arrayWalletUserMain.map((element) => {
            return element.asset
        }))
        if (arrayWalletUserMainFiat == -1)
            return -1

        let somme = 0
        arrayWalletUserMain.map((element) => {
            let result = roundMe(arrayWalletUserMainFiat[element.asset] * element.amount, 2)
            arrayFinal.push({
                asset: element.asset,
                type: element.type,
                amount: parseFloat(element.amount),
                price: parseFloat(arrayWalletUserMainFiat[element.asset]),
                total: parseFloat(result)
            })

            somme += result
        })

        const arrayWalletUserTradeFiat = await this.getFiatCurrencies(arrayWalletUserTrade.map((element) => {
            return element.asset
        }))
        if (arrayWalletUserTradeFiat == -1)
            return -1

        arrayWalletUserTrade.map((element) => {
            let result = roundMe(arrayWalletUserTradeFiat[element.asset] * element.amount, 2)
            arrayFinal.push({
                asset: element.asset,
                type: element.type,
                amount: parseFloat(element.amount),
                price: parseFloat(arrayWalletUserTradeFiat[element.asset]),
                total: parseFloat(result)
            })

            somme += result
        })

        console.log('arrayFinal : ', arrayFinal)
        console.log(this.prefix + 'Somme finale : ', somme)

        return [arrayFinal, roundMe(somme, 2)]
    }
}

module.exports = KucoinClass;
