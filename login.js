const fs = require("fs");
const login = require("facebook-chat-api");

const config = require('config');

var credentials = {email: config.get('email'), password: config.get('password')};

login(credentials, (err, api) => {
    if(err) return console.error(err);

    api.setOption({logLevel: "silent"});

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
