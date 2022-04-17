// --------------------------------------------------
// db.js contains the logic to connect to both local and 
// deployed databases
// --------------------------------------------------
const { connect } = require('mongoose');


/**
 * Connect to local or deployed database.
 * @async
 */
const connectToDB = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            console.log('In PRODUCTION environment')
            const res = await connect(process.env.MONGO_URL);
            // console.log(res)
        } else if (process.env.NODE_ENV === 'development') {
            console.log('In DEVELOPMENT environment')
            // const res = await connect(process.env.MONGO_LOCAL);
            const res = await connect(process.env.MONGO_URL);
            // console.log(res)
        }
        console.log("Successful connection to DB")
    } catch (err) {
        console.log('Error:', err);
    }
}

connectToDB();