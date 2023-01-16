const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static("client/build"));

app.get("/api", (_, res) => {
    res.json({ message: "NEW Test from server!" });
});

app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
