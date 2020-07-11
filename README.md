# Rambot-McRamram

## About 

Rambot-McRamram is a Facebook Messenger chatbot designed to interact with the 2020 Colorado State University Marching Band Leadership Team.  Added as a member to our group chat in Facebook Messenger, Rambot currently provides three features:  Ram Facts, Conversation Starters, and Meeting Reminders.  The bot also has a command interface for when I'm not able to open up a terminal.  Rambot is a node application run locally on a Raspberry Pi 3B.

### Ram Facts

When anybody sends a message that contains the word Ram, Rambot gets super excited!  He let's us know by sending us a message with a randomly selected ram fact from a list contained in the configuration file.
![Ram Facts](/images/RamFacts.PNG)

### Conversation Starters

To build the team before the season starts, Rambot starts conversation by sending a conversation starter at the weekly times specified in the configuration file.  Conversation starters are selected randomly from the list provided in the configuration file, though no starter is used twice.
![Conversation Starter](/images/ConversationStarter.PNG)

### Meeting Reminders

The configuration file contains dates and times of when we meet together with our band director over Zoom.  Rambot sends reminders of the meetings the day of to help those of us who might have forgotten.
![Meeting Reminders](/images/MeetingReminder.PNG)

### Command Interface

Rambot can be controlled via a private chat in Facebook Messenger for when I'm not able to quickly access a terminal.  Provided commands are currently
* `/stop` - Stops the node application.
* `/pause` - Pauses bot activity.
* `/unpause` - Unpauses bot activity.
* `/conv <threadIDName>` - Sends a conversation starter to the specified threadID.
* `/say <threadIDName> <message>` - Sends a message to the specified threadID.

## Built With
[facebook-chat-api](https://github.com/Schmavery/facebook-chat-api)
