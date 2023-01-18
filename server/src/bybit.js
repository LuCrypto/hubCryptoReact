// Pour Bybit
const bybit = async () => {
    let { SpotClientV3 } = require('bybit-api');

    const spotClientV3 = new SpotClientV3({
        key: 'YpGigoVY2VAaBZ8546',
        secret: 'VsC3hiqiMccBJTTOU7ILvNAPTNgkfSbVLMLD'
    });

    // console.log('spotClientV3 : ', spotClientV3);

    let arrayBalances = await spotClientV3.getBalances();
    // console.log('arrayBalances : ', arrayBalances.result.balances);

    // Pas bon de faire comme ça pour la somme
    let somme = 0;
    arrayBalances.result.balances.forEach((element) => {
        console.log('===Bybit | ' + element.coin + ' : ' + element.total);
        somme += element.total;
    });

    return parseFloat(somme)
};

module.exports = {
    bybit
};