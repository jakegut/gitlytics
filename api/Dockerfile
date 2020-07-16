FROM python:3.8-slim

RUN apt-get update && apt-get install -y gcc unixodbc-dev libpq-dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .