// https://www.npmjs.com/package/tronweb?activeTab=readme
// https://developers.tron.network/reference/getaccount
// https://www.trongrid.io/dashboard
const tronlink = async () => {
    const TronWeb = require('tronweb')
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { "TRON-PRO-API-KEY": '0c3185b7-6507-4405-9d01-620c5b276b8c' },
        privateKey: 'a8e57c8602eb6d1e0c2c27dd81dc779902de74ee83266a78e9ea8eb81ff84f6c'
    })
    const prefix = '---TRONLINK | '

    const myTronlinkAddress = 'TVLkepuiaDYesEHDVELBHTTCqnWFiVXsN3'

    // Pour récupérer le solde d'USDT de mon adresse
    const contractUSDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    const {
        abi
    } = await tronWeb.trx.getContract(contractUSDT);
    const contract = tronWeb.contract(abi.entrys, contractUSDT);
    const balance = await contract.methods.balanceOf(myTronlinkAddress).call();
    console.log(prefix + "balance:", balance.toString() / 1000000, 'USDT');

    let balanceInfos = await tronWeb.trx.getAccount(myTronlinkAddress)
    console.log(prefix + 'Available balance : ', balanceInfos.balance / 1000000, 'TRX');
    console.log(prefix + 'account_resource - FROZEN : ', balanceInfos.account_resource.frozen_balance_for_energy.frozen_balance / 1000000, 'TRX');

    let balanceBandwidthEnergy = await tronWeb.trx.getAccountResources(myTronlinkAddress)
    console.log(prefix + 'account_resource - BANDWIDTH LIMIT : ', balanceBandwidthEnergy.freeNetLimit);
    console.log(prefix + 'account_resource - ENERGY LIMIT : ', balanceBandwidthEnergy.EnergyLimit);
    console.log(prefix + 'account_resource - tronPowerLimit : ', balanceBandwidthEnergy.tronPowerLimit);

    // let balanceTRX = await tronWeb.trx.getBalance(myTronlinkAddress)
    // console.log(prefix+'balanceInfos3 : ', balanceTRX / 1000000, 'TRX');

    let reward = await tronWeb.trx.getReward(myTronlinkAddress)
    console.log(prefix + 'reward : ', reward / 1000000, 'TRX');
}

module.exports = {
    tronlink
}