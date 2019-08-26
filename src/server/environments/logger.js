let winston = require("winston");
const {LoggingWinston} = require('@google-cloud/logging-winston');

module.exports = () => {
    if (!!this.instance) {
        return this.instance;
    } else {
        let environment = process.env.FOODBODI_ENV || "dev";
        if (environment === 'dev') {
            this.instance = winston.createLogger({
                level : "info",
                transports : [
                    new winston.transports.Console()
                ]
            })
        } else if (environment === "prod") {
            const gcloudWinston = new LoggingWinston();
            this.instance = winston.createLogger({
                level : "info",
                transports : [
                    new winston.transports.Console(),
                    gcloudWinston
                ]
            })
        }
        return this.instance;
    }
};