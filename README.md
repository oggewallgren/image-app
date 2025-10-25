# Readme

## Instructions

Welcome to Knodd's programming challenge!

Your task is split in three parts: an implementation from scratch, an improvement to existing code, and finally a high-level software design.

All parts of the challenge are somewhat open-ended and you are free to make assumptions, improvements and trade-offs as you see fit.
When we meet, we will go through it all and you will have time to explain your decisions.
We are very interested in hearing your thought process, so remember to document what you are doing.

- Submit part 1 and 2 ahead of the interview by forking this repo and making a pull request with your changes.
  If you do not want to create a public pull request you can clone the repository, upload it to a private repo and invite us to it.
  Write the PR description and commit messages as you would if this was a PR for your team to review.

- Part 3 can be sent via email.

If you have any questions, just send us an email!

_Good luck!_

![Child chewing on laptop](https://media.giphy.com/media/a90M32EUW1u80/giphy.gif)

## Challenge

### 1. Write a React client for an image uploading API

This repository contains a backend directory with an image uploading API and a frontend directory with a React app. The React app is just a Vite project in Typescript and has no implemented functionality.

We would like you to implement functionality so that the user can select an image from their local storage, type a name for it, and have your app upload it to the server using the API.

### 2. Improve the API

The backend directory contains an image uploading API written in Node/Express. Currently it lacks som basic functionality and validation. We would like you to improve the API so that:

- it only accepts JPEG and PNG files
- The images are automatically resized squares of size 400x400
- The filename for the stored image is the 10 first letters of the provided name, no åäö, spaces replaced with dashes and ended with the timestamp for the time uploading.
  - I.e. "Min blå cykel" should be saved as `min-bla-cy_20200513124514.png`

### 3. Design an image upload and resizing service that works at scale

Imagine that we are constructing a system that lets millions of users upload images of all sizes and formats, and that these images will be resized to three standard resolutions and made available to the world. The system needs to respond quickly to the uploading user, notify the user of when resizes are complete and finally serve the images to users around the world with the lowest possible latency. Ideally we'd like to keep costs down as well.

Make a proposal for the high-level design of such a system. What components would you choose? What trade-offs would you need to make?

For this task you are free to present your solution in any way you wish: on paper, in a digital document or drawn on a whiteboard. We will discuss it when we meet.

## Image Uploading App

This repository contains an image uploading app.

- The backend is a Node & Express API using a Mongo database with Mongoose.
- The frontend is a React app.

### Setup

To run the app, you will need to install:

- [Node](https://nodejs.org/en)
- [Docker](https://docs.docker.com/get-docker/)

### Backend

Start the backend by starting the Docker daemon, moving into the backend directory.

1. Start the database (in a docker container)

```bash
npm run start:db
```

2. Install dependencies

```bash
npm install
```

3. Start the backend

```bash
npm start
```

The API is now available on `http://localhost:3002`

Any changes to the backend code should hot reload and you do not have to rebuild the backend between changes.

If you want to see the data in the database directly, you can use [MongoDB Compass](https://www.mongodb.com/products/compass) and connect to the database on `localhost:27017`.

4. Stop and reset the database (by removing the container)

```bash
npm run stop:db
```

### API

The currently defined API routes are

#### `GET /images`

Returns an array with metadata for stored images like:

```JSON
[{
    "_id": "5ebab07f4129f90039095823",
    "name": "myimage",
    "path": "/img/myimage.jpeg"
}]
```

#### `POST /images`

Expects a body of `Content-Type: multipart/formdata` with entries

- `name`: Image name as a String
- `photo`: Image file

Returns the uploaded image metadata:

```JSON
{
    "_id": "5ebab07f4129f90039095823",
    "name": "myimage",
    "path": "/img/myimage.jpeg"
}
```

Example using cURL with a local filed named `uno_reverse.jpg` in the same directory:

```sh
curl -X POST -H "Content-Type: multipart/form-data" http://localhost:3002/images -F 'name=Example' -F 'photo=@uno_reverse.jpg'
```

#### `GET /img/filename.jpg`

Uploaded files are served as static files from the `/img` directory

### Tests

There is a set of integration tests for the API that runs against a local test database.

To run the tests:

1. Make sure the Docker Daemon is running

2. Start the test database (in a docker container)

```bash
npm run start:db
```

3. Run the integration tests

```bash
npm run test:integration
```

4. Stop the test database (by removing the container)

```bash
npm run stop:db
```

## Frontend

The frontend is a React app. Currently the app is just created and has no implemented functionality.
Run commands the following commands in the frontend directory.

Install Dependencies
`npm install`

Start the app
`npm run dev`

The app is now available on `http://localhost:3000`

## Resources

- [Express](https://expressjs.com/en/guide/routing.html)
- [Mongoose](https://mongoosejs.com/docs/index.html)
- [React](https://reactjs.org/tutorial/tutorial.html)
- [Multer](https://github.com/expressjs/multer)
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData)
- [Vitest](https://vitest.dev/)
- [Supertest](https://www.npmjs.com/package/supertest)
