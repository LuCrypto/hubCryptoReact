const { fs, roundMe } = require('../utilitaire/utilitaire.js');

class AptosClass {
    constructor(DATA_PRICE_CRYPTO) {
        this.aptos = require('aptos');
        this.PREFIX = '===Aptos | ';

        this.NODE_URL = 'https://fullnode.mainnet.aptoslabs.com';
        this.FAUCET_URL = 'https://faucet.mainnet.aptoslabs.com';

        this.APT_CONTRACT = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';
        this.TAPT_CONTRACT = '0x1::coin::CoinStore<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin>';
        this.USDT_CONTRACT = '0x1::coin::CoinStore<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>';

        this.CONTRACT_ADDRESS = {
            APT_CONTRACT: {
                contract: this.APT_CONTRACT,
                division: 100000000,
                symbol: 'APT'
            },
            TAPT_CONTRACT: {
                contract: this.TAPT_CONTRACT,
                division: 100000000,
                symbol: 'TAPT'
            },
            USDT_CONTRACT: {
                contract: this.USDT_CONTRACT,
                division: 1000000,
                symbol: 'USDT'
            }
        }

        this.DATA_PRICE_CRYPTO = DATA_PRICE_CRYPTO;
        this.MARTIAN_WALLET_1 = '0xe6f55872df5d1dfe3650c457887bbb49c97d7a398eb84de358efc9c6d1bcb39b';
        this.PETRA_WALLET_1 = '0xa30f5ef4e8319f92943cebc53d50b4f7519e66f701a0a942337ed962b306a8a8';

        setInterval(() => {
            this.update()
        }, 1000 * process.env.REFRESH_TIME_FOR_DEFI);
    }

    update = async () => {
        let martianBalance = await this.getBalanceAptos(this.MARTIAN_WALLET_1);
        console.log('martianBalance', martianBalance)

        const saveAptosJSON = martianBalance

        await fs.writeFile('./server/src/data/aptos.json', JSON.stringify(saveAptosJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });

        // TODO
        // this.getBalanceAptos(this.PETRA_WALLET_1);
    }

    // https://aptos-labs.github.io/ts-sdk-doc/classes/AptosClient.html
    // https://fullnode.devnet.aptoslabs.com/v1/spec#/operations/get_account_resources
    // Permet de récupérer les assets d'une adresse Aptos
    getBalanceAptos = async (walletAddress) => {
        const client = new this.aptos.AptosClient(this.NODE_URL);
        // const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);

        let assets = await client.getAccountResources(walletAddress).then((account) => {
            let results = [];
            // Je traite APT, tAPT et USDT pour l'instant
            account.forEach((element) => {
                for (const [key, value] of Object.entries(this.CONTRACT_ADDRESS)) {
                    if (element.type === value.contract) {
                        results.push({
                            contract: value.contract,
                            symbol: value.symbol,
                            amount: roundMe(element.data.coin.value / value.division)
                        })
                    } else {
                        console.log('PAS DE CONTRACT !!!');
                        console.log('element.type : ', element.type);
                    }
                }
            });

            return results;
        });

        console.log('assets : ', assets);

        // Put price and value for each asset
        assets.forEach((asset) => {
            let price = null;
            try {
                price = parseFloat(this.DATA_PRICE_CRYPTO[asset.symbol].quote.USD.price);
            } catch (error) {
                console.log('ERROR : ', error);
            }

            if (price) {
                asset.value = roundMe(parseFloat(price) * parseFloat(asset.amount), 2);
                asset.price = price;
            } else {
                asset.value = -1;
                asset.price = -1;
            }
        });

        const object = {
            total: -1,
            address: walletAddress,
            type: 'martian wallet',
            assets: assets
        }

        return object;
    }

    // Pour le réseau Aptos
    exampleAptos = async () => {
    };
}

module.exports = AptosClass;