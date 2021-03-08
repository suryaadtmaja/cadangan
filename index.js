require("dotenv").config();
const minimist = require("minimist");
const fs = require("fs-extra");
const mysqldump = require("mysqldump");
const dayjs = require("dayjs");
const ora = require("ora");
const cron = require("node-cron");

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

async function mysql() {
  await mysqldump({
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
}

async function getDb() {
  switch (args.type) {
    case "mysql":
      mysql().catch((e) => console.log(e));
      break;

    default:
      break;
  }
}

async function backupInit() {
  // cron.schedule("* * * * *", () => {
  getDb().catch((e) => {
    console.log(e);
  });
  // });
}

backupInit().catch((e) => {
  console.log(e);
});
