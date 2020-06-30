const fs = require("fs");
const login = require("facebook-chat-api");

const config = require("./chat_bot_config.json");

var credentials = {email: config.email, password: config.password};

login(credentials, (err, api) => {
    if(err) return console.error(err);

    api.setOption({logLevel: "silent"});

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
