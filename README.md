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

## Manual Build and Deploy (Cloud Run)

### Prerequisites

- Docker with buildx support (e.g., Colima on macOS)
- `gcloud` CLI authenticated
- Docker configured for Artifact Registry: `gcloud auth configure-docker us-central1-docker.pkg.dev`

### Build and push

```bash
docker buildx build --platform linux/amd64 --provenance=false \
  -t us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/blog:latest \
  --push .
```

### Deploy

```bash
gcloud run deploy $SERVICE_NAME \
  --image=us-central1-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/blog:latest \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --port=8080 \
  --set-env-vars=USE_TLS=false,CONFIG_PATH=/config/serverConfig.json \
  --update-secrets=/config/serverConfig.json=$SECRET_NAME:latest \
  --allow-unauthenticated
```

### Update server config secret

```bash
gcloud secrets versions add $SECRET_NAME \
  --data-file=serverConfig.json \
  --project=$PROJECT_ID
```

After updating the secret, redeploy or force the running service to pick up the new version:

```bash
gcloud run services update $SERVICE_NAME \
  --region=us-central1 \
  --update-secrets=/config/serverConfig.json=$SECRET_NAME:latest
```

## CI/CD

Pushes to `master` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds, pushes, and deploys automatically. Requires these GitHub Actions secrets:

- `GCP_PROJECT_ID`
- `GCP_REGION`
- `WIF_PROVIDER`
- `WIF_SERVICE_ACCOUNT`
- `CLIENT_CONFIG` — Full contents of `clientConfig.json` (needed at build time for the client bundle)

