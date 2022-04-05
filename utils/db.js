// Connecting to the database
const { connect } = require('mongoose');


const connectToDB = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await connect(process.env.MONGO_URL);
        } else if (process.env.NODE_ENV === 'development') {
            console.log('In development environment')
            await connect(process.env.MONGO_LOCAL); // default port number is 27017
        }
        console.log("Successful connection to DB")
    } catch (err) {
        console.log(err);
    }
}

connectToDB();