# Whatsapp-bot

<br>

This is a whatsapp bot I created for EPiC Devs ([wait who?](#who-are-epic-devs)) to make academic life a tiny bit easier. It uses a [Whatsapp web library](https://github.com/pedroslopez/whatsapp-web.js) and acts just like a regular user. It was built alongside a node server and is currently deployed to Heroku in order to make it available 24/7...or so I thought. Since I'm using a free Heroku dyno, I use cron-jobs to keep the dyno from idling and also to perform some _interesting_ calculations at specific times. The bot often interacts with a MongoDB cloud database to supplement its functionalities.

<br>

## Table of contents

- [Overview](#overview)
  - [The problem](#the-problem)
  - [My solution](#my-solution)
  - [Demo](#demo)
- [Features](#features)
- [Built with](#built-with)
- [Who are EPiC Devs?](#who-are-epic-devs)
- [Tips](#tips)

<br>

## Overview

### The problem

Timetables are always a pain to memorize, going through hundreds of messages from class group chats to filter out important information is equally painful. But worst of them all is trooping all the way to class just to find out it was cancelled a few minutes/hours prior. I'm also sure we've all been through that moment where almost everyone forgets what exactly the assignment given was about or the exact deadline. I'm not even going to talk about the number of times resources for a particular course can be requested in a single day 😭

<p style="font-size: 25px">But...</p>
<img src="./assets/wait-for-it-barney-stinson.gif" width=400 alt="Wait for it">
<br><br>

What if someone could always remind you when it's time for class on your favorite messaging platform? 😮

What if you don't have to ever memorize any timetable? 😪

What if someone always forwards important messages and links from class groups automatically to your dm? 🤯

What if someone always keeps track of your assignments and reminds you when it's close to the deadline?🥺

What if someone can consistently send all resources for a particular course anytime they are requested? 😲

.<br>.<br>.<br>
Ladies and gentlemen, I present to you.... <span style="font-size: 18px">"Ethereal"</span>, a whatsapp personal assistant... or bot if you will.
<br><br>
<img src="./assets/standing ovation.gif" width=400 alt="Standing ovation">

<br>

### My solution

<span style="font-size: 18px">Ethereal</span> seeks to make life easier for [EPiC Devs](#epic-devs) by:

- Forwarding important **announcements** and **links** from class groups to our private whatsapp group.
- Reminding us individually about the times we have class.
- Getting our timetable for the week, and for the current day depending on the elective each of us offers in as little as 4 quick interactions (_< 20secs_) or by typing 1 command (_< 10secs_); As opposed to annoyingly asking someone else who may or may not be available at that moment.
- Sending all course materials (PDFs, powerpoints etc) for any course as and when requested.
- Reminding and giving us detailed descriptions of assignments we have for each course.

<br>

## Demo

https://user-images.githubusercontent.com/44934037/164345371-b4ed39ed-a7cb-4486-87ee-d6a5c5fdd7bc.mp4

Forgive the quality 🙏🏽, Github requires videos to be <10mb which is a pain for a long one like this.

Made up for the low quality with good background music though! 🤍

Oh and I couldn't add all the functionalities of the bot in the demo as it was getting way too long 😪

<br>

## Features

| Command | Description | Role (to use command) |
| ---------- | ---------- | ---- |
| `!admins` | Get all current bot admins| admin |
| `!class` | Get the current day's classes, depending on user's elective| - |
| `!classes` | Get the classes for the week, depending on user's elective | - |
| `!commands` | Get commands available to a user sent to their DM in a _whatsapp list_ | - |
| `!env` | Check the _environment_ the bot is running in _(Production/Development)_ | admin |
| `!everyone` | Ping everyone in a group | admin |
| `!exams` | Get the current exams timetable | - |
| `!grouplink` \| `!gl` | Get the current group's invite link | - |
| `!help` | Get commands available to a user per their role | - |
| `!mute` | Mute the bot | admin |
| `!unmute` \| `!speak` | Unmute the bot | admin |
| `!notify` | Subscribe to get notified for class | - |
| `!notify stop` | Unsubscribe from getting notified for class | - |
| `!notify status` | Get class notifications status | admin |
| `!notify enable all` | Enable all class notifications for the day | admin |
| `!notify disable all` | Disable all class notifications for the day | admin |
| `!ping` | Check if bot is active | - |
| `!sc` | Get the bot's source code | - |
| `!slides` | Get all courses materials (slides, books etc.) | - |
| `!status` | Get the bot's diagnostics | admin |
| `!subs` | Get all users who have subscribed to be notified for class | admin |

<br>

## Built with

- NodeJS
- Express
- MongoDB with Mongoose
- [Whatsapp-web.js library](https://github.com/pedroslopez/whatsapp-web.js)

<br>

## Who are EPiC Devs

<img src="./assets/EPiC Devs README intro.png" alt="EPiC Devs introduction">
<br>
<sub>This was <i>painfully</i> done in a README last year when we coined the name for our project :)</sub><br>
<sub>I definitely didn't take too much time on this :)))</sub>
<br><br>
We are a group of exquisitely talented, focused and diligent individuals who consistently exceed expectations. Credits to both of my colleagues for inspiring features for the bot.

Check us out!:

- [Andrews (UI/UX designer)](https://www.linkedin.com/in/andrewsantwiaddo)
- [Papafio (Frontend developer/Graphic designer)](https://www.linkedin.com/in/nii-laryea-quartey-papafio-229440176)
- [Divine (Frontend developer)](https://www.linkedin.com/in/divineanum)

<br>

## Tips:

This project would be an interesting one to clone and run as it's heavily personalized but if you are up to the task, I recommend the following extensions in VS Code in order to have more insight into the codebase:

- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) to see comments with keywords highlighted differently.

- [TODO.md Kanban Taskboard](https://marketplace.visualstudio.com/items?itemName=coddx.coddx-alpha) to see my TODO list in a more elegant form.

Feel free to hit me up if you do have interest in it 👋🏽
