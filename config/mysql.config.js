module.exports = {
    HOST: process.env.MYSQL_HOST || "localhost",
    PORT: process.env.MYSQL_PORT || "3306",
    USERNAME: process.env.MYSQL_USERNAME || "admin",
    PASSWORD: process.env.MYSQL_PASSWORD || "ykst1648",
    DATABASE: process.env.MYSQL_DATABASE || "tastylog"
};