const { getBalanceToken, fs, roundMe } = require('../utilitaire/utilitaire.js');

class bscClass {
    constructor(Web3, DATA_PRICE_CRYPTO) {
        this.ABI_BSC = JSON.parse('[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')
        // A DEPLACER DANS UN FICHIER .ENV
        this.ADRESSE_METAMASK_PRINCIPAL = '0x51C09bEED2479cB2C03F2D8c6c8f340f963572f5'

        this.CONTRACT_ADDRESS = {
            // PREMIER
            BUSD_CONTRACT_ADDRESS: {
                symbol: 'BUSD',
                contract: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
                decimalsMultiply: 18
            },
            BTCB_CONTRACT_ADDRESS: {
                symbol: 'BTCB',
                contract: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
                decimalsMultiply: 18
            },
            EGLD_CONTRACT_ADDRESS: {
                symbol: 'EGLD',
                contract: '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe',
                decimalsMultiply: 18
            },
            AAVE_CONTRACT_ADDRESS: {
                symbol: 'AAVE',
                contract: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
                decimalsMultiply: 18
            },
            FLUX_CONTRACT_ADDRESS: {
                symbol: 'FLUX',
                contract: '0xaFF9084f2374585879e8B434C399E29E80ccE635',
                decimalsMultiply: 8
            },
        }

        this.DATA_PRICE_CRYPTO = DATA_PRICE_CRYPTO

        this.web3NetworkBSC = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
        this.PREFIX = '===BSC | ';

        setInterval(() => {
            this.update()
        }, 1000 * process.env.REFRESH_TIME_FOR_DEFI);
    }

    update = async () => {
        let assets = null
        try {
            assets = await this.getAssets()
        } catch (error) {
            console.log('Error: ', error)
            return -1
        }

        console.log('assets', assets)

        const saveBSCJSON = {
            total: -1,
            address: this.ADRESSE_METAMASK_PRINCIPAL,
            assets: assets
        }

        await fs.writeFile('./server/src/data/bsc.json', JSON.stringify(saveBSCJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    // Pour le réseau Binance Smart Chain
    getAssets = async () => {
        // Pour savoir combien j'ai de BNB
        let balanceBNB = await this.web3NetworkBSC.eth.getBalance(this.ADRESSE_METAMASK_PRINCIPAL, (error, result) => {
            if (error) {
                console.error(error);
                return -1;
            } else {
                // console.log(result); // la balance du compte en wei
                console.log(this.PREFIX + 'BNB : ', this.web3NetworkBSC.utils.fromWei(result)); // la balance du compte en wei
                return result;
            }
        });

        balanceBNB = roundMe(parseFloat(this.web3NetworkBSC.utils.fromWei(balanceBNB), 2));

        let multiplyPromises = [];
        // Parcours le tableau CONTRACT_ADDRESS et afficher les cles et valeurs
        for (const [key, value] of Object.entries(this.CONTRACT_ADDRESS)) {
            // console.log(this.PREFIX + `${key}: ${value}`);
            multiplyPromises.push(getBalanceToken(this.PREFIX, this.ADRESSE_METAMASK_PRINCIPAL, this.web3NetworkBSC, this.ABI_BSC, value.contract, value.coin, value.decimalsMultiply));
        }

        // On attend que toutes les promesses soient résolues
        let amountArray = await Promise.all(multiplyPromises).then((values) => {
            // console.log('values : ', values)
            return values
        });

        // On prépare notre objet pour le JSON
        let myAssets = [];
        myAssets.push({
            symbol: 'BNB',
            amount: balanceBNB
        });

        let index = 0;
        for (const [key, value] of Object.entries(this.CONTRACT_ADDRESS)) {
            myAssets.push({
                symbol: value.symbol,
                amount: roundMe(parseFloat(amountArray[index++]), 2)
            });
        }

        // VALUE ET PRICE
        myAssets.forEach((asset) => {
            const price = parseFloat(this.DATA_PRICE_CRYPTO[asset.symbol].quote.USD.price);
            if (price) {
                asset.value = roundMe(parseFloat(price) * parseFloat(asset.amount), 2);
                asset.price = price;
            } else {
                asset.value = -1;
                asset.price = -1;
            }
        });


        return myAssets
    }
}

module.exports = bscClass