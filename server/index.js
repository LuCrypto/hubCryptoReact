const { initDataExchange, readDataExchange } = require('./src/exchanges');
const { initDataDefi, readDataDefi } = require('./src/defi');

const myServer = () => {
    // Server setup
    const express = require("express");
    const path = require("path");
    const PORT = process.env.PORT || 3001;
    const app = express();

    app.use(express.json());
    app.use(express.static("client/build"));

    app.get("/datahubcrypto", async (_, res) => {
        console.log('/datahubcrypto CALL');

        const valueExchange = await readDataExchange();
        // const valueDefi = await readDataDefi();

        let finalValue = {
            exchanges: valueExchange,
            defi: valueDefi
        }

        console.log('finalValue', finalValue);
        res.json(finalValue);
    });

    app.get("/*", (_, res) => {
        res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });

    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
}

const main = async () => {
    myServer()

    // initDataExchange()
    initDataDefi()
}

main()