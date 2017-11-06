# WDI21 Boston Project \#1 - Tic Tac Toe

## Overview

For my first project at General Assembly I was tasked with creating a Single
Page Application for the web that would allow a user to play a game of Tic Tac
Toe against another user.  My user stories for this project were:

- As a user I can sign up, sign in, and sign out of the app.
- Once signed in, I can play a game of Tic Tac Toe against a friend.
- I can see a message that tells me if I won, lost or tied.
- I can play multiple games and see my game history and statistics by clicking
 on a button.

In addition to these user stories, some of the project requirements were:

- The app must be deployed on Github pages.
- Must make frequent, cohesive commits dating back to the first day of building the app.
- Must create this README and document the process and technologies used
- Must use jQuery for DOM manipulation and AJAX for interacting with the provided API

## Technologies Used

- HTML5
- CSS3
- SASS
- Bootstrap
- JavaScript
- jQuery
- Google Fonts

I used HTML5 to build the basic structure of the app and CSS3, SASS and Bootstrap to style.

The forms and modals were done using Bootstrap.

Javascript is used to build the game logic, send AJAX calls and jQuery is used to interact with the DOM and update the view

## Features/Additions

In addition to the basic requirements, I added some special features.

- Play against the computer
  - The user can play against the computer
  - 50% of the time, the computer will make the first move
- Styling
  - The gameboard will display a light show if someone wins the game

  ## Wireframe
![Tic Tac Toe Wireframe](https://c1.staticflickr.com/5/4555/38186861432_20845afb1a_z.jpg)

## Bugs

There is one bug I am aware of when playing against the computer.  The computers move is set to delay for one second to give the illusion of playing against another player who is taking time to make their move.  During that one second delay, the user may click as many squares as possible.  I need to figure out a way to turn the click function off while the computer is making its move.

## Updates
As for future updates, I plan to use the API's ability to patch in a second player from a remote device.
