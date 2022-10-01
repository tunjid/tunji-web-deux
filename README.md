# Tunji Web Deux

Welcome to my attempt at a custom personal CMS. It is a bare bones reactive server that notifies its clients
when it's database models are modified and maintains a changelist for clients who may have missed notifications.

There are 2 main directories:

Server: An Express backend backed by MongoDb
Client: A single page web app bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

The server uses a MongoDb database. Install it from the official source [here](https://docs.mongodb.com/manual/installation/).

Once installed, make sure the mongod process is running.

NOTE:
The sign up route in both the `UserController` and `UserRouter` files are commented out. Should you want to
try these endpoints out, you should uncomment them first.

There are a few files you will want to add that are not in version control.

### Server:

In the project root:

serverConfig.json: A json file containing meta data the server needs to run:

```json
{
  "env": "dev",
  "mongoUrl": "mongodb://127.0.0.1:27017/tunji-web?gssapiServiceName=mongodb",
  "sessionSecret": "hush-hush",
  "apiEndpoint": "https://localhost:8080",
  "rootIndexImage": "aPictureUrl.jpg",
  "archiveListDefaultImage": "anotherPictureUrl.png",
  "googleCloud": {
    "type": "service_account",
    "bucket": "your-bucket-name",
    "project_id": "your-gcloud-project-id",
    "private_key_id": "somePrivateKeyId",
    "private_key": "-----BEGIN PRIVATE KEY-----\n-----\n-----END PRIVATE KEY-----\n",
    "client_email": "service_account.gserviceaccount.com",
    "client_id": "numbers",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "aUrl"
  },
  "corsAllowedOrigins": [
    "https://www.tunjid.com",
    "https://www.tunji.dev",
    "https://localhost:8080"
  ],
  "corsImageSources": [
    "'self'",
    "https:"
  ],
  "corsConnectSources": [
    "'self'",
    "https://www.tunjid.com",
    "https://www.tunji.dev",
    "https://localhost:8080"
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

You don't need the google cloud service account credentials if you do not plan to upload images.
The server will run just fine without, image upload endpoints will simply error.


clientConfig.json

```json
{
  "env": "dev",
  "googleAnalyticsId": "someId",
  "apiEndpoint": "https://localhost:8080",
  "rootIndexImage": "aUrl",
  "archiveListDefaultImage": "anotherUrl"
}
```

domain.crt and domain.key: SSL keys for https, I got mine through lets encrypt, but to run locally any made up ones should do


## Running it all

This project uses esbuild. In the root directory, run:
`yarn install`
`yarn build`
`node ./packages/server/dist/index.js`

If you would much rather not, just run `sh app.sh` in the root dir; it will configure both the client and server and start
the server via `index.js` in the build dir.

The server is https only on port 8080. Visit it through:

`https://localhost:8080`

