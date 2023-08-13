FROM node:18 AS builder

WORKDIR /stage
COPY package.json .
RUN yarn
ARG VITE_INSTANCE_HOSTNAME
RUN test -n "$VITE_INSTANCE_HOSTNAME" # Setting an instance hostname is mandatory
COPY . .
RUN yarn build

FROM builder AS server
WORKDIR /app
COPY --from=builder /stage/build/ /app/build
COPY --from=builder /stage/node_modules/ /app/node_modules
COPY --from=builder /stage/package.json /app/
EXPOSE 3000
CMD node /app/build/index.js