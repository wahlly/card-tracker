#using alpine as the base image due to its small size
FROM node:alpine
#set the working directory in the container
WORKDIR /app
#copy all files, package.json and package-lock.json files
COPY ./build /app
COPY package*.json /app/
RUN npm install
EXPOSE 3000
CMD node ./index.js