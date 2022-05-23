require('dotenv').config();
const mongoClient = require('mongodb').MongoClient;
const DATABASE_NAME = process.env.DATABASE_NAME;

async function read(collectionName){
    const client = await mongoClient.connect(process.env.DATABASE);
    var database = client.db(DATABASE_NAME);
    var collection = database.collection(collectionName);
    var result = await collection.find({}).toArray();
    client.close(); 
    return result;
}

async function find(collectionName, sender_psid){
    const client = await mongoClient.connect(process.env.DATABASE);
    var database = client.db(DATABASE_NAME);
    var collection = database.collection(collectionName);
    var result = await collection.find({"sender_psid": sender_psid}).toArray();
    client.close();
    return result;
}

/* Update state for user message to page is false. It locks auto reply guide doc for this user */
async function update(collectionName, sender_psid){
    var updateTime = new Date().getTime();

    const client = await mongoClient.connect(process.env.DATABASE);
    var database = client.db(DATABASE_NAME);
    var query = {"sender_psid": sender_psid};
    var newValue = {$set: {"state": false, "updateTime": updateTime}};
    var result = await database.collection(collectionName).updateOne(query, newValue);
    client.close();
    return;
}

/* insert new user inbox to page (this user wasn't message to page in the past)*/
async function insert(collectionName, sender_psid){
    var updateTime = new Date().getTime();
    var stateArr = await read(collectionName);

    // State: true mean if user send message to page, this is first message and we must auto reply guide for them
    var data = {
        "sender_psid": sender_psid,
        "state": false,
        "updateTime": updateTime
    };

    stateArr.push(data);
    write(stateArr, collectionName);
    return;
}

async function write(data, collectionName){
    const client = await mongoClient.connect(process.env.DATABASE);
    var database = client.db(DATABASE_NAME);
    var collection = database.collection(collectionName);
    collection.remove({});
    await collection.insert(data);
    client.close();
}

module.exports = {
    read,
    find,
    update,
    insert,
    write
}