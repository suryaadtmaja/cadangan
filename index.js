require("dotenv").config();
const minimist = require("minimist");
const fs = require("fs-extra");
const dayjs = require("dayjs");
const ora = require("ora");
const cron = require("node-cron");
const execa = require("execa");
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
  try {
    const { stdout: mysqldump } = execa("mysqldump", [
      "-u",
      `${database.username}`,
      `-p${database.password}`,
      `${database.database}`,
    ]);
    mysqldump
      .pipe(
        fs.createWriteStream(
          `backup-${database.database}-${dayjs(
            new Date(),
            "DD-MM-YYYY HH:mm:ss"
          )}.sql`
        )
      )
      .on("Finish", () => {
        console.log("Backup Completed");
      })
      .on("error", (e) => {
        console.log(e);
      });
  } catch (e) {
    console.log("Error");
  }
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
