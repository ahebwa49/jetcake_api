## Clone this repo

You should first clone this backend application in your console by the running `git clone` followed by the provided web url.

## Available Scripts

After cloning the app from github, In the project directory, you can run:

### `yarn install`

Will install all the dependecies

### Add .env file

Create a .env file and add the following environment variables. The first one is a link to the mongodb atlas cluster where the data is persisted. The other is a port where the application is running.

MONGO_URI=mongodb+srv://jetcake:jetcake@jetcake-el6cq.mongodb.net/test?retryWrites=true\
PORT=4000

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

With the backend running on localhost port 4000, you can now go back and setup the frontend application.

With nodemon installed, the app will reload everytime a change is made.<br />
