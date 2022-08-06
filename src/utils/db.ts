// --------------------------------------------------
// db.js contains the logic to connect to both local and
// deployed databases
// --------------------------------------------------
const { connect } = require("mongoose");

/**
 * Connect to local or deployed database.
 * @async
 */
const connectToDB = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.log("[DB] In PRODUCTION environment");
      const res = await connect(process.env.MONGO_URL);
      // console.log('[DB]', res)
    } else if (process.env.NODE_ENV === "development") {
      console.log("[DB] In DEVELOPMENT environment");
      // const res = await connect(process.env.MONGO_LOCAL);
      const res = await connect(process.env.MONGO_URL);
      // console.log('[DB]', res)
    }
    console.log("[DB] Successful connection to DB");
  } catch (err) {
    console.error("[DB ERROR]", err);
  }
};

connectToDB();
