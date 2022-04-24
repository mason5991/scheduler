FROM node:14.18.0-alpine
EXPOSE 3000:3000
WORKDIR /app
COPY . .
RUN yarn install
CMD ["yarn", "dev"]
