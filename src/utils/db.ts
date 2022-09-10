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
    const env = process.env.NODE_ENV as string;
    let envLog = "[DB] In ";

    // Explicitly checking for both environments just in case the env becomes undefined or anything apart from "development" and "production"
    if (env === "production") envLog += "PRODUCTION";
    else if (env === "development") envLog += "DEVELOPMENT";

    console.log(envLog, "environment");
    const res = await connect(process.env.MONGO_URL);
    // console.log('[DB]', res)

    console.log("[DB] Successful connection to DB");
  } catch (err) {
    console.error("[DB ERROR]", err);
  }
};

connectToDB();
