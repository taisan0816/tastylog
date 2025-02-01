const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();

//テンプレートエンジンのejsを使うときの決まり文句
app.set("view engine", "ejs");

//expressでできていることを隠蔽する
app.disable("x-powered-by");

// Static resource routing
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public",express.static(path.join(__dirname, "/public")));

//Set access log
//静的コンテンツのログは不要なので、そのあとに書く
app.use(accesslogger());

// Dynamic resource rooting
app.use("/", require("./routes/index.js"));
app.use("/test", async (req, res, next )=> {
    const {promisify} = require("util");
    const path = require("path");
    const {sql} = require("@garafu/mysql-fileloader")({root: path.join(__dirname, "./lib/database/sql")});
    const config = require("./config/mysql.config.js");
    const mysql = require("mysql");
    const con = mysql.createConnection({
        host: config.HOST,
        port: config.PORT,
        user: config.USERNAME,
        password: config.PASSWORD,
        database: config.DATABASE
    });

    const client = {
        connect: promisify(con.connect).bind(con),
        query: promisify(con.query).bind(con),
        end: promisify(con.end).bind(con)
    };
    let data;

    try {
        await client.connect();
        data = await client.query(await sql("SELECT_SHOP_BASIC_BY_ID"));
        console.log(data);
    }catch(err) {
        next(err);
    }finally{
        await client.end();
    }

    res.end("OK");
});

// Set application log.
app.use(applicationlogger());

app.listen(PORT, ()=> {
    logger.application.info(`Application listening at ${PORT}`);
});


