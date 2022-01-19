const mongo = require("mongodb");

const userRoutes = require("./user-routes");
const collectionRoutes = require("./collection-routes");
const objectRoutes = require("./object-routes");
const labelRoutes = require("./label-routes");

function buildRoutes(router, db, authClient) {
    router.use(async function(req, res, next) {
        if (req.path == "/" || req.path == "/sign-in" || req.path == "/sign-in/" || req.path == "/auth" || await isUserAuthenticated(req, db)) {
            next();
        } else {
            res.status(401);
            res.send("You are not logged in! Visit the main page to log in.");
            next("router");
        }
    });
    userRoutes.addUserRoutes(router, db, authClient);
    collectionRoutes.addCollectionRoutes(router, db);
    objectRoutes.addObjectRoutes(router, db);
    labelRoutes.addLabelRoutes(router, db);
}

async function isUserAuthenticated(req, db) {
    const sessTable = db.collection("sessions");
    const sessID = await req.headers.authorization;
    if (sessID !== undefined) {
        const result = await sessTable.find({ _id: new mongo.ObjectId(sessID) });
        const count = await result.count();
        return (count > 0);
    } else {
        return false;
    }
}

module.exports = { buildRoutes };