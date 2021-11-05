const mongo = require("mongodb");

async function addObjectRoutes(router, db) {
    // GET all objects for a collection
    router.get("/collection/:id/object", async function(req, res) {
        const objectTable = db.collection("objects");
        const objectArray = [];
        const collectionID = new mongo.ObjectId(req.params.id);
        const query = { collection_id: collectionID };
        const options = {
            projection: { _id: 1 },
        };
        const cursor = objectTable.find(query, options);
        await cursor.forEach(function(doc) {
            objectArray.push(doc);
        });
        res.send(objectArray);
    });

    // GET object by ID
    router.get("/object/:id", async function(req, res) {
        const objectTable = db.collection("objects");
        const objectID = new mongo.ObjectId(req.params.id);
        const query = { _id: objectID };
        const options = {
            projection: { _id: 1, object: 1 },
        };
        const object = await objectTable.findOne(query, options);
        res.send(object);
    });

    // POST object
    router.post("/object", async function(req, res) {
        const objectTable = db.collection("objects");
        const collectionID = new mongo.ObjectId(req.body.collection_id);
        const newObject = { collection_id: collectionID, object: req.body.object };
        console.log(newObject);
        const result = await objectTable.insertOne(newObject);
        res.send(result);
    });
}

module.exports = { addObjectRoutes };