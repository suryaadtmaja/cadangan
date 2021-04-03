# Cadangan

Backup mysql database regularly using cadangan, you can spesificly set the schedule for backup in index.js if you're not familiar with cronjob, you can use https://crontab.guru/ and change the schedule \* \* \* \* \*

    async function  backupInit() {
        cron.schedule("* * * * *", () => {
    	    getDb().catch((e) => {
    		    console.log(e);
    	    });
        });
    }

> Cadangan's simple tools created using node.js
