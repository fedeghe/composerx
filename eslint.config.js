module.exports = [{
    name:'xxx',
    files: ["**/*.js" ],
    rules: {
        "max-len": ["error", { "code": 160 }],
        "no-unused-vars": ["error", { "vars": "local", "args": "all" }],
        "semi": ["error"],
        "func-names": ["error", "never"]
    },
    ignores: [ "dist/*", "dist/**/*", "coverage/", "tests/*", "jest.config.js"]
}];