var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_TEST_URL;

// insert new document into mongo
const newDbDocument = (url, data) => {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.MONGODB_DB);
    var myobj = data;
    dbo.collection(process.env.MONGODB_COLLECTION).insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log(`Added user ${data.user_info.display_name}`)
      db.close();
    });return newDbDocument
  }) 
};

// update current users track list
const updateDbDocument = (url, data) => {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(process.env.MONGODB_DB);
    var myquery = {"user_info.id":data.user_info.id};
    var newvalues = { $set: data };
    dbo.collection(process.env.MONGODB_COLLECTION).updateOne(myquery, newvalues, { upsert: true }, function(err, res) {
      if (err) throw err;
      console.log(`Updated user ${data.user_info.display_name}`)
      db.close();
    });return updateDbDocument
  });

}


const dbSend = (newData) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.MONGODB_DB);
        dbo.collection(process.env.MONGODB_COLLECTION).find({}).toArray(function(err, result) {
            if (err) throw err;      
        //   check if user in database
        result.map(user => user.user_info.id).includes(newData.user_info.id) ? updateDbDocument(url, newData) : newDbDocument(url, newData)
        db.close();
        });
    });
}

module.exports = dbSend
