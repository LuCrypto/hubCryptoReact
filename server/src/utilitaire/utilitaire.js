const fs = require('fs').promises;
const assert = require('assert');
// Utilitaires

// Pour arrondir avec decimal
const roundMe = (number, decimal = 2) => {
    return (Math.round(number * (10 ** decimal))) / (10 ** decimal)
}

// Ce code crée une fonction nommée promisify qui prend en paramètre une fonction inner.
// La fonction promisify retourne une nouvelle promesse qui résout ou rejette en fonction du résultat de l'appel de la fonction inner.
// La fonction promisify peut être utilisée pour convertir une fonction qui utilise une fonction de rappel en une fonction qui retourne une promesse. 
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

// Utilitaire
// Permet d'avoir le montant d'un token
const getBalanceToken = async (prefixNetwork, addressPublic, web3Network, abi, contractAddress, display = 'Balance', decimalsMultiply = 18) => {
    // Récupérez le contrat du token
    const contract = new web3Network.eth.Contract(abi, contractAddress);

    // Afficher les différentes méthodes du contrat ABI
    // console.log('abi length : ', abi.length);
    // console.log('contract : ', contract.methods);

    // Récupérez le solde du compte
    const balance = await contract.methods.balanceOf(addressPublic).call() / 10 ** decimalsMultiply;
    console.log(prefixNetwork + display + ' : ', balance);

    return balance;
}



module.exports = {
    roundMe,
    promisify,
    getBalanceToken,
    assert,
    fs
}