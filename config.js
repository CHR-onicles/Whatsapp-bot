// Add values if you are not using env vars
const fs = require("fs");
require("dotenv").config();

module.exports = {
    session: JSON.parse(
        process.env.SESSION ||
        fs.readFileSync(__dirname + "/session.json", { encoding: "utf8" })
    ), //if not using env vars create a file named session.json
};