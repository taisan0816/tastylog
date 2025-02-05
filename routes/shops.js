const router = require("express").Router();
const { MYSQLClient, sql } = require("../lib/database/client.js");
router.get("/:id", async (req, res, next) => {
    let id = req.params.id;

    Promise.all([
        MYSQLClient.executeQuery(
            await sql("SELECT_SHOP_DETAIL_BY_ID"),
            [id]
        )
    ]).then((results) => {
        console.log(results);
        let data = results[0][0];
        res.render("./shops/index.ejs",data);
    }).catch((err) => {
        console.log(err);
        next(err);
    });
});

module.exports = router;