const { roundMe, assert } = require('./utilitaire.js');

// Binance
class BinanceClass {
    constructor() {
        const { Spot } = require('@binance/connector');

        const _apiKeyBinance = 'sjhAdf5XMiJFC7ykBBFqKKTUJ7Okkmi9hCHboUGjZ2iu095I4oNzUu1r1VwkIcmU'
        const _apiSecretBinance = 'vyOFcZvZpYoJjJNIaN4a1P5bkL2nUrOIn7W5jUUUPnXE9pixQvUhzG1N7jwzahx2'
        const _client = new Spot(_apiKeyBinance, _apiSecretBinance)

        this.client = _client
        this.prefix = '===Binance | '

        this.arrayWalletUser = null
        this.btcPriceDollard = null

        this.update()

    }

    update = async () => {
        // walletSpotBinance
        this.arrayWalletUser = await this.client.userAsset().then(response => {
            return response.data
        })

        // get price BTC
        this.btcPriceDollard = await this.client.avgPrice('BTCBUSD').then(response => {
            return response.data.price
        })
    }

    sommeWalletSpotBinance = async (btcPriceDollard) => {
        /*
        arrayWalletUser
        {
            asset: 'BUSD',
            free: '289.55575138',
            locked: '0',
            freeze: '0',
            withdrawing: '0',
            ipoable: '0',
            btcValuation: '0.01370073'
        },
        etc...
        */

        // assert of this.arrayWalletUser !== null
        // assert.notStrictEqual(this.arrayWalletUser, null, 'ERROR : this.arrayWalletUser === null')

        let sommeSpot = 0
        this.arrayWalletUser.map((element) => {
            // console.log('asset : ', element.asset)
            // console.log('Quantité : ', element.btcValuation * btcPriceDollard)
            let montantDollard = Math.round((element.btcValuation * btcPriceDollard) * 100) / 100
            sommeSpot += montantDollard
            // console.log('Montant en dollard : ', montantDollard)
        })

        return roundMe(sommeSpot, 2)
    }

    earnStakingFlexible = async () => {
        // EARN STAKING flexible
        let arrayStakingFlexible = []
        await this.client.savingsFlexibleProductPosition().then(response => {
            response.data.map((element) => {
                arrayStakingFlexible.push({
                    asset: element.asset,
                    amount: element.totalAmount,
                })
            })
        });

        // console.log('arrayStakingFlexible : ', arrayStakingFlexible)

        let arrayStakingFlexibleResults = []

        await Promise.all(arrayStakingFlexible.map(async (element) => {
            arrayStakingFlexibleResults.push(await this.client.avgPrice(element.asset + 'BUSD').then(response => {
                return response.data.price * element.amount
            }))
        }))

        // console.log('arrayStakingFlexibleResults2 : ', arrayStakingFlexibleResults)

        let sommeStakingFlexible = 0
        arrayStakingFlexibleResults.map((element) => {
            sommeStakingFlexible += element
        })

        // console.log('sommeStakingFlexible : ', sommeStakingFlexible)

        return roundMe(sommeStakingFlexible, 2)
    }

    earnStakingLock = async () => {
        // EARN STAKING lock
        let arrayStakingLock = []
        await this.client.stakingProductPosition('STAKING').then(response => {
            // console.log('response:  ', response.data)
            response.data.map((element) => {
                arrayStakingLock.push({
                    asset: element.asset,
                    amount: element.amount,
                })
            })
        })

        // console.log('arrayStakingLock : ', arrayStakingLock)

        let sommeStakingLock = 0
        await Promise.all(arrayStakingLock.map(async (element) => {
            sommeStakingLock += await this.client.avgPrice(element.asset + 'BUSD').then(response => {
                return response.data.price * element.amount
            })
            // console.log('sommeStakingLock : ', sommeStakingLock)
        }))

        return roundMe(sommeStakingLock, 2)
    }

    // userAsset -> balance Binance
    // avgPrice  -> prix moyen d'un token
    binanceWallet = async () => {
        const sommeEarnStakingFlexible = await this.earnStakingFlexible()
        const sommeEarnStakingLock = await this.earnStakingLock()
        const sommeSpot = await this.sommeWalletSpotBinance(btcPriceDollard)
        const sommeEarn = sommeEarnStakingFlexible + sommeEarnStakingLock
        const sommeFinale = sommeEarn + sommeSpot

        console.log(this.prefix + 'btcPriceDollard : ', btcPriceDollard + ' $\n\n')
        console.log(this.prefix + 'sommeEarnStakingLock : ', sommeEarnStakingLock)
        console.log(this.prefix + 'sommeEarnStakingFlexible : ', sommeEarnStakingFlexible)
        console.log(this.prefix + 'Somme spot finale : ', sommeSpot)
        console.log(this.prefix + 'Somme earn finale : ', sommeEarn)
        console.log(this.prefix + 'Somme finale : ', sommeFinale)

        return {
            name: "binance",
            total: roundMe(sommeFinale),
            assets: []
        }
    }
}

module.exports = BinanceClass;