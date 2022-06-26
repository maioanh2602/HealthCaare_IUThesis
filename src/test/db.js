const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongodb


async function connectMongo() {
  mongodb = await MongoMemoryServer.create();

  const uri = mongodb.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function closeConnection() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongodb.stop();
}


async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

module.exports = {
  connectMongo,
  closeConnection,
  clearDatabase,
}