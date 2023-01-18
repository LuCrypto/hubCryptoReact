// Pour le réseau Aptos
const aptos = async () => {
    const aptos = require('aptos');
    const prefix = '===Aptos | ';

    const NODE_URL = 'https://fullnode.mainnet.aptoslabs.com';
    const FAUCET_URL = 'https://faucet.mainnet.aptoslabs.com';

    const aptosType = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';
    const aptosStackType = '0x1::coin::CoinStore<0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin>';
    const usdtType = '0x1::coin::CoinStore<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>';

    let martianWallet1 = '0xe6f55872df5d1dfe3650c457887bbb49c97d7a398eb84de358efc9c6d1bcb39b';
    let petraWallet1 = '0xa30f5ef4e8319f92943cebc53d50b4f7519e66f701a0a942337ed962b306a8a8';

    // https://aptos-labs.github.io/ts-sdk-doc/classes/AptosClient.html
    // https://fullnode.devnet.aptoslabs.com/v1/spec#/operations/get_account_resources
    // Permet de récupérer les assets d'une adresse Aptos
    const getBalanceAptos = async (walletAddress) => {
        const client = new aptos.AptosClient(NODE_URL);
        // const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);

        client.getAccountResources(walletAddress).then((account) => {
            // console.log('account : ', account);

            // Je traite APT, tAPT et USDT pour l'instant
            account.forEach((element) => {
                // console.log('element : ', element);
                if (element.type === aptosType) {
                    console.log(prefix + 'APT : ', element.data.coin.value / 100000000);
                } else if (element.type === aptosStackType) {
                    console.log(prefix + 'tAPT : ', element.data.coin.value / 100000000);
                } else if (element.type === usdtType) {
                    console.log(prefix + 'USDT : ', element.data.coin.value / 1000000);
                }
            });
        });

        // EXAMPLE
        // =====================================
        // let resources = await client.getAccountResources(account1.address());
        // let accountResource = resources.find((r) => r.type === aptosCoin);
        // console.log(`account1 coins: ${accountResource.data.coin.value}. Should be 100_000_000!`);

        // const account2 = new aptos.AptosAccount();
        // await faucetClient.fundAccount(account2.address(), 0);
        // resources = await client.getAccountResources(account2.address());
        // accountResource = resources.find((r) => r.type === aptosCoin);
        // console.log(`account2 coins: ${accountResource.data.coin.value}. Should be 0!`);

        // const payload = {
        //     type: "entry_function_payload",
        //     function: "0x1::coin::transfer",
        //     type_arguments: ["0x1::aptos_coin::AptosCoin"],
        //     arguments: [account2.address().hex(), 717],
        // };
        // const txnRequest = await client.generateTransaction(account1.address(), payload);
        // const signedTxn = await client.signTransaction(account1, txnRequest);
        // const transactionRes = await client.submitTransaction(signedTxn);
        // await client.waitForTransaction(transactionRes.hash);

        // resources = await client.getAccountResources(account2.address());
        // accountResource = resources.find((r) => r.type === aptosCoin);
        // console.log(`account2 coins: ${accountResource.data.coin.value}. Should be 717!`);
        // =====================================
    };

    getBalanceAptos(martianWallet1);
    getBalanceAptos(petraWallet1);
}

module.exports = aptos;