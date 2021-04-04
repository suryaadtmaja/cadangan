# Cadangan

Backup mysql database regularly using cadangan, you can specifically set the schedule for backup in index.js if you're not familiar with cronjob, you can use https://crontab.guru/ and change the schedule \* \* \* \* \*

    async function  backupInit() {
        cron.schedule("* * * * *", () => {
    	    getDb().catch((e) => {
    		    console.log(e);
    	    });
        });
    }

# How to start cadangan

- Install pm2 https://pm2.keymetrics.io/
- clone this repo
- change the script start in package.json node "index.js --type mysql --dbname databasename"
- start the project by running `pm2 start npm --name "backup name" -- start"`

> Created using node.js
