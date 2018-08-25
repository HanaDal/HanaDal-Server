module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": "off",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};