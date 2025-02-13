const router = require("express").Router();
const {MySQLClient, sql} = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";

let validateReviewData = function(req) {
    let body = req.body;
    let isValid = true, error = {};

    if(body.visit && !moment(body.visit, DATE_FORMAT).isValid()){
        isValid = false;
        error.visit = "訪問日の日付文字列が不正です。";
    }

    if(isValid) {
        return undefined;
    }

    return error;
}

let createReviewData = function (req) {
    let body = req.body, date;

    return {
        shopId: req.params.shopId,
        score: parseFloat(body.score),
        visit: (date = moment(body.visit, DATE_FORMAT)) && date.isValid() ? date.toDate() : null,
        post: new Date(),
        description: body.description
    };
};


router.get("/regist/:shopId(\\d+)", async (req, res, next) => {
    let shopId = req.params.shopId;
    let shop, shopName, review, results;
    try {
        results = await MySQLClient.executeQuery(
            await sql("SELECT_SHOP_BASIC_BY_ID"),
            [shopId]
        );
        shop = results[0];
        shopName = shop.name;
        review = {};
        res.render("./account/reviews/regist-form.ejs", {shopId, shopName, review});
    }catch(err){
        next(err);
    }
});

router.post("/regist/:shopId(\\d+)", (req, res, next) => {
    let review = createReviewData(req);
    let { shopId, shopName } = req.body;
    res.render("./account/reviews/regist-form.ejs", {shopId, shopName, review});
});

router.post("/regist/confirm", (req, res, next) => {
    let error = validateReviewData(req);
    let review = createReviewData(req);
    let { shopId, shopName } = req.body;

    if(error){
        res.render("./account/reviews/regist-form.ejs", {error, shopId, shopName, review});
        return;
    }

    res.render("./account/reviews/regist-confirm.ejs", {shopId, shopName, review});
});

module.exports = router;