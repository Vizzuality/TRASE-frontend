module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
          1,
            "always"
        ],
        "no-console": [1, { allow: ["warn", "error"] }],
        "no-debugger": 1
    },
    "parserOptions": {
      "ecmaFeatures": {
        "experimentalObjectRestSpread": true
      },
      "sourceType": "module"
    },
    "globals": {
      NODE_ENV_DEV: true,
      API_URL: true,
      API_CMS_URL: true
    }
};
