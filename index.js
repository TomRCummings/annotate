require("dotenv").config();

const mongoUtil = require("./mongoUtil");

const routeBuilder = require("./routes/routes");

mongoUtil.connectToServer(function(err) {
    if (err) {
        console.error(err);
        return;
    }

    const express = require("express");
    const parser = require("body-parser");

    const app = express();
    const router = express.Router();
    const port = 3000;

    routeBuilder.buildRoutes(router, mongoUtil.getDb());

    app.use(parser.json());

    app.use("/", router);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});