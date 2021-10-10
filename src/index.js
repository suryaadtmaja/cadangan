require("dotenv").config();
const minimist = require("minimist");
const fs = require("fs-extra");
const dayjs = require("dayjs");
const cron = require("node-cron");
const execa = require("execa");
const args = minimist(process.argv.slice(2), {
  string: "type",
  string: "username",
  string: "password",
  string: "dbname",
  alias: {
    user: "username",
    pass: "password",
    db: "dbname",
  },
});

const database = {
  username: args.username,
  password: args.password,
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
    mysqldump.pipe(
      fs.createWriteStream(
        `backup-${database.database}-${dayjs(
          new Date(),
          "DD-MM-YYYY HH:mm:ss"
        )}.sql`
      )
    );
    console.log("Backup Completed");
  } catch (e) {
    console.log("Error");
  }
}

async function getDb() {
  switch (args.type) {
    case "mysql":
      mysql();
      break;
    default:
      break;
  }
}

async function backupInit() {
  cron.schedule("* * * * *", () => {
    getDb().catch((e) => {
      console.log(e);
    });
  });
}

backupInit().catch((e) => {
  console.log(e);
});
