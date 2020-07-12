const fs = require("fs");
const login = require("facebook-chat-api");
const config = require('config');

const facts = config.get('facts');
const convStarters = config.get('convStarters');
const convDates = config.get('convDates');
const meetDates = config.get('meetDates');

var convUsed = new Array(convStarters.length).fill(0);

var paused = false;

console.log("Starting Conversation Starter Bot!");
console.log("Checking against dates:\n" + JSON.stringify(convDates));
setInterval(checkForConvStartTime,60000);

console.log("Starting Reminder Bot!");
console.log("Checking against dates:\n" + JSON.stringify(meetDates));
setInterval(checkForReminderTime,60000);

console.log("Starting Ram Facts Chatbot!");

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({logLevel: "silent"});

    var stopListening = api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        api.markAsRead(event.threadID, (err) => {
            if(err) console.error(err);
        });

	console.log("Got an event from threadID: " + event.threadID);

        switch(event.type) {
            case "message":
		if(!paused){
			var lowercaseMessage = event.body.toLowerCase();
			if(lowercaseMessage.includes("ram")) {
			    sendMessage("Did somebody say Ram?  I love Rams! Here's a cool Ram fact!\n\n" +  facts[Math.floor(Math.random() * facts.length)], event.threadID);
			}
		}
		if(event.threadID == config.get('prestonThreadID')){
			if(event.body[0] == '/')
				runCommand(event.body);
		}
                break;
            case "event":
                console.log(event);
                break;
        }
    });
});

function runCommand(message){
    try {
	const arguments = message.split(' ');	
	switch(arguments[0]){
		case "/conv":
			sendMessage(getConvStarter() + "  Share with the team!",config.get(arguments[1]));
			break;
		case "/say":
			sendMessage(message.replace(arguments[0] + " " + arguments[1],""),config.get(arguments[1]));
			break;
		case "/stop":
			process.exit(0);
			break;
		case "/pause":
			paused = true;
			break;
		case "/unpause":
			paused = false;
			break;
	}
    } catch (e) {
	sendMessage("Error caught when processing command sent:\n" + e.toString(),config.get('prestonThreadID')); 
    }
}

function sendMessage(message,threadID){
	console.log("Sending message to thread " + threadID + ":\n\"" + message + "\"");
	login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
	    if(err) return console.error(err);

    	api.setOptions({logLevel: "silent"});

	api.sendMessage(message,threadID);
	});
}

function checkForReminderTime(){
	if(!paused){
		const now = new Date();
		//console.log("Checking if it's time for a meeting reminder at time  " + now);
		for(dateObj of meetDates){
			const date = JSONtoDate(dateObj);

			if(now.getFullYear() === date.getFullYear() &&
			   now.getMonth() === date.getMonth() &&
			   now.getDate() === date.getDate()){
				   if(now.getHours() === date.getHours() &&
				      now.getMinutes() === date.getMinutes()){
					console.log("It's time for a meeting reminder!");
					sendMessage("The meeting is starting now!",config.get('leadershipThreadID'));
				   }
				   if(now.getHours() === date.getHours() &&
				      now.getMinutes() === date.getMinutes()-30){
					console.log("It's time for a meeting reminder!");
					sendMessage("The meeting starts in 30 min!",config.get('leadershipThreadID'));

				   }
				   if(now.getHours() === 10 &&
				      now.getMinutes() === 0){
					console.log("It's time for a meeting reminder!");
					sendMessage("Just a reminder, there is a meeting today!",config.get('leadershipThreadID'));
				   }
			}
		}
	}
}

function checkForConvStartTime(){
	if(!paused){
		const now = new Date();
		//console.log("Checking if it's time for a conv starter at time " + now);
		for(dateObj of convDates){
			const date = JSONtoDate(dateObj);

			if(now.getDay() === date.getDay() &&
			   now.getHours() === date.getHours() &&
			   now.getMinutes() === date.getMinutes()){
				console.log("It's time for a conversation starter!");
				sendMessage(getConvStarter() + "  Share with the team!",config.get('leadershipThreadID'));
			}
		}
	}
}

function getConvStarter(){

	if(!(convUsed.includes(0))){
		sendMessage("You need to write more conversation starters!",config.get('prestonThreadID'));
		return "What's your favorite color, green, gold, or white?";
	}
	

	var randomConvStarter = Math.floor(Math.random() * convStarters.length);
	console.log("Array is " + convUsed);
	console.log("Random is " + randomConvStarter);
	while(convUsed[randomConvStarter]){
		console.log("Array is " + convUsed);
		console.log(randomConvStarter + " is taken already");
		randomConvStarter = Math.floor(Math.random() * convStarters.length);
		console.log("Random is " + randomConvStarter);
	}
	convUsed[randomConvStarter] = 1;
	console.log("Array is " + convUsed);
	console.log("Returning " + convStarters[randomConvStarter]);
	return convStarters[randomConvStarter];
}

function JSONtoDate(dateObj){
        return date = new Date(dateObj.year,dateObj.month-1,dateObj.day,dateObj.hours,dateObj.minutes,0,0);
}
