const mongo = require("mongodb");

async function addUserRoutes(router, db, authClient) {

    // GET Google sign-in url
    router.get("/sign-in", async function(req, res) {
        const authScope = [
            "https://www.googleapis.com/auth/plus.me",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ];
        const url = authClient.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: authScope,
        });
        res.status(200);
        res.set("Content-Type", "application/json");
        res.send({ "url" : url });
    });

    // POST Google token
    router.post("/sign-in/", async function(req, res) {
        const code = req.query.code;
        const token = await authClient.getToken(code);
        const tokenData = token.tokens;
        const ticket = await authClient.verifyIdToken({
            idToken: tokenData.id_token,
            audience: process.env.clientID,
        });
        const payload = ticket.getPayload();
        const userTable = db.collection("users");
        let userId = "";
        if (await userExists(userTable, payload["sub"])) {
            const query = { google_id: payload["sub"] };
            const result = await userTable.findOne(query);
            userId = result._id;
        } else {
            const result = await userTable.insertOne({ google_id: payload["sub"], first_name: payload["given_name"], last_name: payload["family_name"], email: payload["email"] });
            userId = result._id;
        }
        const sessTable = db.collection("sessions");
        const now = new Date();
        now.setDate(now.getDate() + 1);
        const result = await sessTable.insertOne({ user_id : userId, expiration: new Date(now) });
        res.status(200);
        res.set("Content-Type", "application/json");
        res.send({ "authToken" : result.insertedId });
    });

    // GET authToken is valid
    router.get("/auth", async function(req, res) {
        const tokenToTest = new mongo.ObjectId(req.headers.authorization);
        const sessTable = db.collection("sessions");
        const query = { _id: tokenToTest };
        const result = await sessTable.find(query);
        const count = await result.count();
        if (count > 0) {
            res.status(200);
        } else {
            res.status(401);
        }
        res.send();
    });

    // GET current user details
    router.get("/user", async function(req, res) {
        const sessTable = db.collection("sessions");
        const sessQuery = { _id: new mongo.ObjectId(req.headers.authorization) };
        const result = await sessTable.findOne(sessQuery);
        const userID = result.user_id;
        const userQuery = { _id: new mongo.ObjectId(userID) };
        const userTable = db.collection("users");
        const userDetails = await userTable.findOne(userQuery);
        res.status(200);
        res.set("Content-Type", "application/json");
        res.send({ "firstName" : userDetails.first_name, "lastName": userDetails.last_name });
    });
}

module.exports = { addUserRoutes };

async function userExists(table, googleUserID) {
    const query = { google_id: googleUserID };
    const options = { _id: 1, google_id: 1 };
    const result = table.find(query, options);
    const count = await result.count();
    return (count > 0);
}