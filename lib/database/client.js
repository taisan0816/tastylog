const path = require("path");
const {sql} = require("@garafu/mysql-fileloader")({root: path.join(__dirname, "./sql")});
const pool = require("./pool.js");
const Transaction = require("./transaction.js");

const MySQLClient = {
    executeQuery: async function (query, values) {
        let results = await pool.executeQuery(query, values);
        return results;
    },
    beginTransaction: async function () {
        let tran = new Transaction();
        await tran.begin();
        return tran;
    }
};

module.exports = {
    MySQLClient,
    sql
};