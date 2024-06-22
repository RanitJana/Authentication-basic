const mongoose = require('mongoose');

const { DB_NAME } = require('../constants.js');

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connection successful.");
    } catch (error) {
        console.log(`MongoDB conenction failed!! Error : ${error}`);
        throw error;
    }
}

module.exports = connectDB;