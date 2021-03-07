require("dotenv").config();
const minimist = require("minimist");
const fs = require("fs-extra");
const mysqldump = require("mysqldump");
const dayjs = require("dayjs");
const ora = require("ora");
const cron = require("node-cron");
const spinner = ora("Loading").start();

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
    spinner.start();
    spinner.color = "yellow";
    spinner.text = "Loading";
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
    spinner.stop();
  } else {
    console.log("error");
  }
}
cron.schedule("*/2 * * * *", () => {
  getDb().catch((e) => {
    console.log(e);
  });
});
