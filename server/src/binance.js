const { roundMe, fs } = require('./utilitaire.js');

// Binance
class BinanceClass {
    constructor() {
        const { Spot } = require('@binance/connector');

        const _apiKeyBinance = 'sjhAdf5XMiJFC7ykBBFqKKTUJ7Okkmi9hCHboUGjZ2iu095I4oNzUu1r1VwkIcmU'
        const _apiSecretBinance = 'vyOFcZvZpYoJjJNIaN4a1P5bkL2nUrOIn7W5jUUUPnXE9pixQvUhzG1N7jwzahx2'
        const _client = new Spot(_apiKeyBinance, _apiSecretBinance)

        this.client = _client
        this.prefix = '===Binance | '

        // Init data
        this.btcPriceDollard = null
        this.sommeWalletSpot = null
        this.stakingFlexible = null
        this.stakingLock = null
        this.totalInEarn = null
        this.total = null

        setInterval(() => {
            this.update()
        }, 1000 * 60);
    }

    // Mettre à jour binance.json
    update = async () => {
        console.log(this.prefix + 'UPDATE')

        // Get price BTC
        this.btcPriceDollard = await this.client.avgPrice('BTCBUSD').then(response => {
            return parseFloat(response.data.price)
        })

        // Call functions
        this.sommeWalletSpot = await this.sommeWalletSpotBinance()
        this.stakingFlexible = await this.earnStakingFlexible()
        this.stakingLock = await this.earnStakingLock()

        this.totalInEarn = parseFloat(this.stakingFlexible + this.stakingLock)
        this.total = parseFloat(this.totalInEarn + this.sommeWalletSpot)

        const saveBinanceJSON = {
            total: this.total,
            totalInEarn: this.totalInEarn,

            btcPriceDollard: this.btcPriceDollard,
            sommeWalletSpot: this.sommeWalletSpot,
            stakingFlexible: this.stakingFlexible,
            stakingLock: this.stakingLock,

            assets: []
        }

        await fs.writeFile('./server/src/data/binance.json', JSON.stringify(saveBinanceJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    // Return somme WALLET SPOT in dollard
    sommeWalletSpotBinance = async () => {
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
        // walletSpotBinance
        const arrayWalletUser = await this.client.userAsset().then(response => {
            return response.data
        })

        let sommeSpot = 0
        arrayWalletUser.map((element) => {
            // console.log('asset : ', element.asset)
            // console.log('Quantité : ', element.btcValuation * btcPriceDollard)
            let montantDollard = Math.round((element.btcValuation * this.btcPriceDollard) * 100) / 100
            sommeSpot += montantDollard
            // console.log('Montant en dollard : ', montantDollard)
        })

        return roundMe(sommeSpot, 2)
    }

    // Return somme of all earn in STAKING FLEXIBLE
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

    // Return somme of all earn in STAKING LOCK
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
}

module.exports = BinanceClass;