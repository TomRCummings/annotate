const userRoutes = require("./user-routes");
const collectionRoutes = require("./collection-routes");
// const objectRoutes = require("./object-routes");
// const labelRoutes = require("./label-routes");

function buildRoutes(router, db) {
    userRoutes.addUserRoutes(router, db);
    collectionRoutes.addCollectionRoutes(router, db);
    // objectRoutes.addObjectRoutes(router, db);
    // labelRoutes.addLabelRoutes(router, db);
}

module.exports = { buildRoutes };