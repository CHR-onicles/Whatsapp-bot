# Project

Project Description

<em>[TODO.md spec & Kanban Board](https://bit.ly/3fCwKfM)</em>

### Todo

- [ ] ⭐❔Tell peeps something when they text "Hi" to the bot in dms???  
- [ ] ⭐❔ Add feature where in DEV environment, all dm-related and forwarding-related functionalities point to my DMs in order not to disturb other peeps and groups.  
- [ ] ⭐❔Add feature where bot sends logs to my dm....basically all important console logs in the codebase  
- [ ] 🐞Bug where after you select your elective for the first time, if you try selecting from the list again... it allows you...add a check to make sure the same user cannot select it gain.  
- [ ] ⭐❔Implement state where in development environment, development bot responds to only you, and does not perform certain functionalities that production bot would perform... like sending notifications  
- [ ] ⚠️❔ Add functionality to mute certain groups, meaning that it wont forward any messages or respond to commands from that particular group => !mute group...bonus if bot deletes that message after some time like in Discord  
- [ ] ⭐Add command to tell bot to forward messages(announcements & links) to user => !forward and !forward stop to stop forwarding messages  
- [ ] ⚠️ Implement system of updating users when something about the bot changes...like updates with bot and stuff  
- [ ] ⭐❔Implement rate-limiting and temp ban on  abuse of certain intensive commands  
- [ ] ⭐❔ Add blacklisted link counter in the misc schema to keep track of blacklisted links sent in groups  
- [ ] ⭐❔Add command for bot to send last deleted message in a group chat if only its text  
- [ ] ⭐❔ When forwarding links, forward the next consecutive message from the same user quoting the link/announcement as its usually more information about the announcement/link...refer to screenshot  
- [ ] ⭐Implement functionality to ignore certain users => logic + update schema  
- [ ] ⚠️Refactor extracting course name into function  
- [ ] ⚠️Refactor repeated variable setters to global variables  
- [ ] ⚠️Refactor code which extracts time from the courses object  
- [ ] ⭐❔Add possible option to unsubscribe temporarily from class notifs for a day  
- [ ] ⭐❔Start mapping out commands in options that will generate another list of commands  
- [ ] ⭐Properly restructure files like other bots on github  

### In Progress

- [ ] ⚠️ Add command for ignoring specific users (blacklist)  
- [ ] ⭐Style output for different roles calling the help command  
- [ ] ⭐Add admin utility commands - one of which should be to stop all class notifications for everyone....like for holidays => !notify allow all || !notify stop all  
- [ ] ⭐Add command for last link/announcement sent => !last link || !last ann  
- [ ] 👍Checkout other symbols as replacements for emojis  
- [ ] ⭐Add command for bot to delete the last thing it sent => !del last  

### Done ✓

- [x] ⚠️Bot's long responses cluttering group chats...send almost everything to dm  
- [x] 🐞List replies should check whether bot is muted or not  

