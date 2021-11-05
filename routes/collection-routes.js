const mongo = require("mongodb");

async function addCollectionRoutes(router, db) {
    // GET all collections
    router.get("/collection", async function(req, res) {
        const collectionTable = db.collection("collections");
        const collectionArray = [];
        const query = { };
        const options = {
            sort: { collection_name: 1 },
            projection: { _id: 1, collection_name: 1, collection_description: 1 },
        };
        const cursor = collectionTable.find(query, options);
        await cursor.forEach(function(doc) {
            collectionArray.push(doc);
        });
        // await cursor.forEach(console.dir);
        res.send(collectionArray);
    });

    // GET collection by ID
    router.get("/collection/:id", async function(req, res) {
        const collectionTable = db.collection("collections");
        const idToGet = new mongo.ObjectId(req.params.id);
        const query = { _id: idToGet };
        const collection = await collectionTable.findOne(query);
        console.log(Object.keys(collection));
        res.send(collection);
    });

    // POST collection
    router.post("/collection", async function(req, res) {
        const collectionTable = db.collection("collections");
        const newCollection = { collection_name: req.body.collection_name, collection_description: req.body.collection_description, object_schema: req.body.object_schema, label_schema: req.body.label_schema };
        console.log(newCollection);
        const result = await collectionTable.insertOne(newCollection);
        res.send(result);
    });
}

module.exports = { addCollectionRoutes };