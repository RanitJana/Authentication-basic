require('dotenv').config();
const connectDB = require('./db/index.js');
const app = require('./app.js');

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app
            .listen(port, () => {
                console.log(`⚙ Server started at port : ${port}`);
            })
            .on('error', (err) => {
                console.log(`Connection Error : ${err}`);
                throw err;
            })
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })