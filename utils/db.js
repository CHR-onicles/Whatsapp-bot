// Connecting to the database
const { connect } = require('mongoose');


const connectToDB = async () => {
    try {
        await connect('mongodb://localhost/bot_test') // default port number is 27017
        console.log("Successful connection to DB")
    } catch (err) {
        console.log(err);
    }
}

connectToDB();