FROM node:24 as node

WORKDIR /mnt

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY build-masks.js .
RUN node build-masks.js

COPY build-osm-sidewalks.js .
RUN node build-osm-sidewalks.js

COPY build-osm-surveillance.js .
RUN node build-osm-surveillance.js

RUN ls

FROM golang:1.24-alpine as go

WORKDIR /mnt

RUN go install github.com/cbroglie/mustache/cmd/mustache@latest

COPY . .

COPY --from=node /mnt/*.geojson .

RUN mustache index.yml index.mustache > index.html

FROM python:3.13-alpine

COPY --from=go /mnt/* .

CMD python -m http.server
