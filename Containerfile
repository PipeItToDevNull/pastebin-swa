FROM node:slim AS build

WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM node:slim

WORKDIR /app

ENV STORAGE_DIR=/app/data

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/src/server.js ./src/server.js

EXPOSE 3000

CMD ["node", "src/server.js"]