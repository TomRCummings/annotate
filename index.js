require("dotenv").config();

const mongoUtil = require("./mongoUtil");

mongoUtil.connectToServer(function(err, mongoClient) {
    if (err) {
        console.error(err);
        return;
    }

    const express = require("express");
    const app = express();
    const port = 3000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        console.log(req.params);
        console.log(req.body);
        next();
    });
});