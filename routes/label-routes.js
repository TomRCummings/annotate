const mongo = require("mongodb");

async function addLabelRoutes(router, db) {
    // GET all labels for an object
    router.get("/object/:id/label", async function(req, res) {
        const labelTable = db.collection("labels");
        const labelArray = [];
        const objectID = new mongo.ObjectId(req.params.id);
        const query = { object_id: objectID };
        const options = { };
        const cursor = labelTable.find(query, options);
        await cursor.forEach(function(doc) {
            labelArray.push(doc);
        });
        res.send(labelArray);
    });

    // GET all labels for a collection
    router.get("/collection/:id/label", async function(req, res) {
        const objectTable = db.collection("objects");
        const labelTable = db.collection("labels");
        const labelArray = [];
        const collectionID = new mongo.ObjectId(req.params.id);
        const query = { collection_id: collectionID };
        const options = { };
        const cursor = objectTable.find(query, options);
        await cursor.forEach(async function(doc) {
            const objectID = new mongo.ObjectId(doc._id);
            const labQuery = { object_id: objectID };
            const labCursor = labelTable.find(labQuery, options);
            await labCursor.forEach(function(label) {
                labelArray.push(label);
            });
        });
        res.send(labelArray);
    });

    // POST label
    router.post("/label", async function(req, res) {
        const labelTable = db.collection("labels");
        const objectID = new mongo.ObjectId(req.body.object_id);
        const newLabel = { object_id: objectID, user_id: req.body.user_id, label: req.body.label };
        const result = await labelTable.insertOne(newLabel);
        res.send(result);
    });
}

module.exports = { addLabelRoutes };