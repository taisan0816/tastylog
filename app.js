const appconfig = require("./config/application.config.js");
const dbconfig = require("./config/mysql.config.js");
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const cookie = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const app = express();

//テンプレートエンジンのejsを使うときの決まり文句
app.set("view engine", "ejs");

//expressでできていることを隠蔽する
app.disable("x-powered-by");

// Expose global method to view engine
app.use((req, res, next) => {
    res.locals.moment = require("moment");
    res.locals.padding = require("./lib/math/math.js").padding;
    next();
});

// Static resource routing
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public",express.static(path.join(__dirname, "/public")));

//Set access log
//静的コンテンツのログは不要なので、そのあとに書く
app.use(accesslogger());

// Set middleware
app.use(cookie());
app.use(session({
    store: new MySQLStore({
        host: dbconfig.HOST,
        port: dbconfig.PORT,
        user: dbconfig.USERNAME,
        password: dbconfig.PASSWORD,
        database: dbconfig.DATABASE
    }),
    secret: appconfig.security.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sid"
}));
app.use(express.urlencoded({extended: true}));

// Dynamic resource rooting
app.use("/account", require("./routes/account.js"));
app.use("/search", require("./routes/search.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));


// Set application log.
app.use(applicationlogger());

app.listen(appconfig.PORT, ()=> {
    logger.application.info(`Application listening at ${appconfig.PORT}`);
});