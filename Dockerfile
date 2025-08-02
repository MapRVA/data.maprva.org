FROM golang:1.24-alpine as go

WORKDIR /mnt
RUN go install github.com/cbroglie/mustache/cmd/mustache@latest
COPY index.yml .
COPY index.mustache .
RUN mustache index.yml index.mustache > index.html

FROM ghcr.io/astral-sh/uv:debian

WORKDIR /mnt
COPY layers ./layers
COPY .python-version pyproject.toml uv.lock index.yml .
RUN uv run layers/main.py

COPY --from=go /mnt/index.html .

CMD uv run python -m http.server
