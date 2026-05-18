const mongoose = require('mongoose');
const uri = 'mongodb+srv://satyamtiwari4445_db_user:Satyam%40123@cluster0.2nkymtm.mongodb.net/employee-performance?appName=Cluster0';

mongoose.connect(uri)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas!');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
