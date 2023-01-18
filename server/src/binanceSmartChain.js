const { getBalanceToken } = require('./utilitaire.js');

const ABI_BSC = JSON.parse('[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')

// A DEPLACER DANS UN FICHIER .ENV
const adresseMetamaskPrincipal = '0x51C09bEED2479cB2C03F2D8c6c8f340f963572f5'

const BUSD_CONTRACT_ADDRESS = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const BTCB_CONTRACT_ADDRESS = '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'
const EGLD_CONTRACT_ADDRESS = '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe'
const AAVE_CONTRACT_ADDRESS = '0xfb6115445Bff7b52FeB98650C87f44907E58f802'
const FLUX_CONTRACT_ADDRESS = '0xaFF9084f2374585879e8B434C399E29E80ccE635'

// Pour le réseau Binance Smart Chain
const binanceSmartChain = async (Web3) => {
    const web3NetworkBSC = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    const prefix = '===BSC | ';

    // Pour savoir combien j'ai de BNB
    web3NetworkBSC.eth.getBalance(adresseMetamaskPrincipal, (error, result) => {
        if (error) {
            console.error(error);
        } else {
            // console.log(result); // la balance du compte en wei
            console.log(prefix + 'BNB : ', web3NetworkBSC.utils.fromWei(result)); // la balance du compte en wei
        }
    });

    getBalanceToken(prefix, adresseMetamaskPrincipal, web3NetworkBSC, ABI_BSC, BUSD_CONTRACT_ADDRESS, 'BUSD');
    getBalanceToken(prefix, adresseMetamaskPrincipal, web3NetworkBSC, ABI_BSC, BTCB_CONTRACT_ADDRESS, 'BTCB');
    getBalanceToken(prefix, adresseMetamaskPrincipal, web3NetworkBSC, ABI_BSC, EGLD_CONTRACT_ADDRESS, 'EGLD');
    getBalanceToken(prefix, adresseMetamaskPrincipal, web3NetworkBSC, ABI_BSC, AAVE_CONTRACT_ADDRESS, 'AAVE');
    getBalanceToken(prefix, adresseMetamaskPrincipal, web3NetworkBSC, ABI_BSC, FLUX_CONTRACT_ADDRESS, 'FLUX', decimalsMultiply = 8);
}


module.exports = {
    binanceSmartChain
}