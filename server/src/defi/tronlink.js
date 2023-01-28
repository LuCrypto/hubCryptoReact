// https://www.npmjs.com/package/tronweb?activeTab=readme
// https://developers.tron.network/reference/getaccount
// https://www.trongrid.io/dashboard

const { roundMe, fs } = require('../utilitaire/utilitaire.js');

class TronlinkClass {
    constructor(DATA_PRICE_CRYPTO) {
        this.TronWeb = require('tronweb')
        this.TRON_WEB = new this.TronWeb({
            fullHost: 'https://api.trongrid.io',
            headers: { "TRON-PRO-API-KEY": process.env.TRONLINK_API_KEY_PUBLIC },
            privateKey: process.env.TRONLINK_API_KEY_PRIVATE
        })
        this.PREFIX = '---TRONLINK | '
        this.MY_TRONLINK_ADDRESS = 'TVLkepuiaDYesEHDVELBHTTCqnWFiVXsN3'
        // Pour récupérer le solde d'USDT de mon adresse
        this.CONTRACT_USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        this.DATA_PRICE_CRYPTO = DATA_PRICE_CRYPTO

        setInterval(() => {
            this.update()
        }, 1000 * process.env.REFRESH_TIME_FOR_DEFI);
    }

    update = async () => {
        const saveTRONLINKJSON = await this.getAllInfos()

        console.log('saveTRONLINKJSON', saveTRONLINKJSON)

        await fs.writeFile('./server/src/data/tronlink.json', JSON.stringify(saveTRONLINKJSON), (err) => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    getAllInfos = async () => {
        const {
            abi
        } = await this.TRON_WEB.trx.getContract(this.CONTRACT_USDT);
        const contract = this.TRON_WEB.contract(abi.entrys, this.CONTRACT_USDT);
        const balance = await contract.methods.balanceOf(this.MY_TRONLINK_ADDRESS).call();
        console.log(this.PREFIX + "balance:", balance.toString() / 1000000, 'USDT');
        const balanceReadable = balance.toString() / 1000000;

        const balanceInfos = await this.TRON_WEB.trx.getAccount(this.MY_TRONLINK_ADDRESS)
        const availableTRX = balanceInfos.balance / 1000000
        console.log(this.PREFIX + 'Available balance : ', availableTRX, 'TRX');

        const frozenTRX = balanceInfos.account_resource.frozen_balance_for_energy.frozen_balance / 1000000
        console.log(this.PREFIX + 'account_resource - FROZEN : ', frozenTRX, 'TRX');

        const balanceBandwidthEnergy = await this.TRON_WEB.trx.getAccountResources(this.MY_TRONLINK_ADDRESS)
        const balanceBandwidthInAddition = balanceBandwidthEnergy.NetLimit
        const balanceEnergy = balanceBandwidthEnergy.EnergyLimit

        console.log(this.PREFIX + 'account_resource - BANDWIDTH : ', balanceBandwidthInAddition);
        console.log(this.PREFIX + 'account_resource - ENERGY : ', balanceEnergy);

        console.log(this.PREFIX + 'account_resource - BANDWIDTH USED : ', balanceBandwidthEnergy.netUsed);
        console.log(this.PREFIX + 'account_resource - ENERGY USED : ', balanceBandwidthEnergy.energyUsed);

        const tronpower = balanceBandwidthEnergy.tronPowerLimit
        console.log(this.PREFIX + 'account_resource - tronPowerLimit : ', balanceBandwidthEnergy.tronPowerLimit);

        // let balanceTRX = await this.TRON_WEB.trx.getBalance(this.MY_TRONLINK_ADDRESS)
        // console.log(this.PREFIX+'balanceInfos3 : ', balanceTRX / 1000000, 'TRX');

        let reward = await this.TRON_WEB.trx.getReward(this.MY_TRONLINK_ADDRESS) / 1000000
        console.log(this.PREFIX + 'reward : ', reward, 'TRX');

        const object = {
            total: -1,
            address: this.MY_TRONLINK_ADDRESS,
            assets: [{
                symbol: 'USDT',
                amount: roundMe(balanceReadable),
                price: this.DATA_PRICE_CRYPTO['USDT'].quote.USD.price,
                value: roundMe(balanceReadable * this.DATA_PRICE_CRYPTO['USDT'].quote.USD.price)
            }],
            availableTRX: roundMe(availableTRX),
            frozenTRX: roundMe(frozenTRX),
            balanceEnergy: roundMe(balanceEnergy),
            balanceBandwidthInAddition: roundMe(balanceBandwidthInAddition),
            tronpower: roundMe(tronpower),
            reward: roundMe(reward)
        }

        return object
    }
}


module.exports = TronlinkClass