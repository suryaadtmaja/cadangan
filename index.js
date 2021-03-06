require("dotenv").config();
const minimist = require("minimist");
const fs = require("fs-extra");
const mysqldump = require("mysqldump");
const dayjs = require("dayjs");

var args = minimist(process.argv.slice(2), {
  string: "type",
  string: "dbname",
  alias: {
    db: "dbname",
  },
});

const database = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: args.dbname,
};

async function getDb() {
  if (args.type == "mysql") {
    const result = await mysqldump({
      connection: {
        host: "localhost",
        user: database.username,
        password: database.password,
        database: database.database,
      },
      dumpToFile: `backup-${database.database}-${dayjs(
        new Date(),
        "DD-MM-YYYY HH:mm:ss"
      )}.sql`,
    });
  } else {
    console.log("error");
  }
}

getDb().catch((e) => {
  console.log(e);
});
