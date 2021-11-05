const { MongoClient } = require("mongodb");

let _db;

module.exports = {
    connectToServer: function(callback) {
        const dbClient = new MongoClient(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@${process.env.clusterURL}/${process.env.dbName}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true });
        dbClient.connect(function(err, client) {
            console.log("MongoDB client is ready!");
            console.log(`${process.env.dbName}`);
            _db = client.db(`${process.env.dbName}`);
            return callback(err);
        });
    },
    getDb: function() {
        return _db;
    },
};