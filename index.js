require("dotenv").config();

const mongoUtil = require("./mongoUtil");
const { OAuth2Client } = require("google-auth-library");

const routeBuilder = require("./routes/routes");

mongoUtil.connectToServer(function(err) {
    if (err) {
        console.error(err);
        return;
    }

    const authClient = new OAuth2Client(process.env.clientID, process.env.clientSecret, process.env.clientRedirect);

    const express = require("express");
    const parser = require("body-parser");

    const app = express();
    const router = express.Router();
    const port = 3000;

    app.use(parser.json());
    routeBuilder.buildRoutes(router, mongoUtil.getDb(), authClient);
    app.use("/", router);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});