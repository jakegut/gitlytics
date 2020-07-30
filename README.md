# Gitlytics
Application that allows faculty to analyze their students' Github collaboration.

## Requirements
All you need to have installed is Docker with docker-compose.

## Setup
To start, you need to setup a Github OAuth application to handle users logging in through Github. 
Once you have the client ID and secret, copy those values into `api/settings.py.example` as `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` respectively.
The `GITHUB_*_URL` variables can be left as default if you're using Github's main service, if you're using Github Enterprise then change these values according to the documentation.

**NOTE:** It's highly recommended to change every variable that involve a `SECRET` to a different value.

In `.env`, change the `POSTGRES_USER` and `POSTGRES_PASSWORD` to something different and change `SQLALCHEMY_DATABASE_URI` in `settings.env.py` accordingly.

Rename `settings.env.py` to `settings.py`

### Local development
To develop locally, follow the above steps and run `docker-compose up --build` and visit `http://localhost:3000`

### Production
For production, go to the file `proxy/conf.d/ngnix.conf` and change the `server_name` to the desired server host name. 
You'll also have to change both `ssl_certificate` and `ssl_certificate_key` to match the `server_name` variable.
To start, run `docker-compose -f docker-compse.yml -f docker-compose.prod.yml up --build -d`.
