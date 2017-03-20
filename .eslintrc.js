module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "warn",
            2,
            { "SwitchCase": 1 }
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
      API_V1_URL: true,
      API_V2_URL: true,
      API_CMS_URL: true,
      API_STORY_CONTENT: true,
      GOOGLE_ANALYTICS_KEY: true,
      ga: true,
      fetch: true
    }
};
