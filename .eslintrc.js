module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "indent": [
            "error",
            4,
            {"SwitchCase":1}
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars":[
            "error",
            {
                "vars":"all",
                "args":"none"
            },
        ],
        "no-console":[
            "off"
        ]
    }
};
