const dotenv = require("dotenv");
const parse = require("dotenv-parse-variables");
before(() => {
    let env = dotenv.config({path: __dirname + '/../.env.test'})
    if (env.error) {
        throw env.error
    }
    env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})
});