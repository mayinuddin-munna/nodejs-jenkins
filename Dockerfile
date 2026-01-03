FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
