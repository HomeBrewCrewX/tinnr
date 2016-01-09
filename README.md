# tinnr+
Dinner done right!
[Tinnr+](http://tinnrplusplus.herokuapp.com)

## Introduction

Tinnr+ is a project dedicated to offering users with many different recipe choices. Our goal is for people to explore new recipes that fit any occasion.

## Getting Started

We have used bower and npm to install our dependencies. We also used Mongod and nodemon to run a local database and server. The bower dependencies will be downloaded to a lib folder, which is pre-specified in the .bowerrc file. Before running locally, run the following code in the command line.
```
bower install
npm install
mongod
nodemon server/server.js
```
Note: Rebuild application using Gulp upon any changes to front-end (angular).
```
gulp build
```

Note: To use mongod, you must set the database path. You can do so with the following command.
```
mongod --dbpath <path>
```

## Tests

Currently, we have a test for our server side inside our test folder.

## File Structure

We separated our files into 3 different folders: Client, Server, and Tests. Within each of these folders, we split our code up into as many files as we could in order to modularize it.

## Choice of Technologies

For this project, we have used AngularJS, Twitter Bootstrap, font awesome, Sass, Lo-dash, Hammer, SendGrid for our front end and Node.js, Express, and MongoDB for our server and database. We also used Gulp for automation of our workflow. For testing we used mocha.

We used MongoDB for the document storage of the Users and the Recipes. We used an ORM called mongoose, which is an npm
module, which gives us easier access to our database. Refer to this link to learn more about mongoose [Mongoose Docs](http://mongoosejs.com/). We used MongoLab as a heroku addon when deploying our app.

## Yummly API
We used Yummly's API for our recipes.
[Yummly API Documentation](https://developer.yummly.com/documentation)

## Features
- Users
- Recipes
- Each user can save recipes
- Swiping for recipes
- Clicking on the saved recipe will forward you to the recipe
- Can filter by Diet, Cuisine, and Course
- Meal preferences saved for individual Users
- Swipe to Add (right) or Pass (left) on a recipe
- Email recipes to yourself for later
- User calendar for adding meals

## In progress
- Compile all saved recipe ingredients to make shopping list
- Show number of user favorites on saved recipes (We already iterate the numberOfSaves in the recipe Schema)
- Refactor to a SQL database for larger production scale
- Implement search box for query string in api call
- Allow user to submit included and excluded recipes
- Display a user dashboard

## Git Workflow

Please refer to the CONTRIBUTING.md file to see our git workflow.

## Style Guide

We used airbnb's es5 style guide at the following link 
[airbnb es5 style guide](https://github.com/airbnb/javascript/tree/master/es5)

## Contributors
 - __Product Owner__: [Sergey Piterman](https://github.com/spiterman)
 - __Scrum Master__:  [Anthony Bibbs](https://github.com/abibbs)
 - __Development Team Members__: [Michael Berber](https://github.com/mickberber), [Yale Yuen](https://github.com/Ycube)

MKS Legacy Project
