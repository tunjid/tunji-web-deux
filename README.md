# Tunji Web Deux

Welcome to my attempt at aa custom personal CMS.

There are 2 main directories:

Server: An Express backend backed by MongoDb
Client: A single page web app bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

There are a few files you will want to ad that are not in version control.

### Server:

In the project root:
config.json: A json file containing meta data the server needs to run:

```json
{
  "mongoUrl": "mongodb://127.0.0.1:27017/tunji-web?gssapiServiceName=mongodb",
  "sessionSecret": "hush-hush",
  "serverEnvironment": "development",
  "corsAllowedOrigins": [
    "https://www.tunjid.com",
    "https://www.tunji.dev",
    "http://localhost:3000"
  ],
  "corsImageSources": [
    "'self'",
    "https:"
  ],
  "corsConnectSources": [
    "'self'",
    "https://www.tunjid.com",
    "https://www.tunji.dev",
    "http://localhost:3000"
  ],
  "corsScriptSources": [
    "'self'",
    "http://www.youtube.com"
  ],
  "corsFrameSources": [
    "'self'",
    "http://www.youtube.com"
  ],
  "mongooseOptions": {
    "retryWrites": true,
    "w": "majority"
  },
  "rootIndexImage": "a.jpg",
  "archiveListDefaultImage": "another.png"
}
```

domain.crt and domain.key: SSL keys for https, I got mine through lets encrypt, but to run locally any made up ones should do

### Client
In the root of the `client` directory:

A .env file resembling:

```
REACT_APP_API_ENDPOINT=https://localhost:8080
REACT_APP_ABOUT_PROFILE_PICTURE=my-face.jpg
INLINE_RUNTIME_CHUNK=false

```

## Running it all

The server and client have their own individual packages, so you will need to yarn install in both the root dir, and client dir.Client

If you would much rather not, just run

`sh app.sh` in the root dir; it will configure both the client and server and start the server via `server.js` in the build dir.

The server is https only on port 8080. Visit it through:

`https://localhost:8080`

To iterate on the frontend client, run `yarn start` from the client dir.
