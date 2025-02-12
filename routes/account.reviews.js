const router = require("express").Router();
const {MySQLClient, sql} = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";

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

router.post("/regist/confirm", (req, res, next) => {
    let review = createReviewData(req);
    console.log(review.visit);
    let { shopId, shopName } = req.body;
    res.render("./account/reviews/regist-confirm.ejs", {shopId, shopName, review});
})

module.exports = router;