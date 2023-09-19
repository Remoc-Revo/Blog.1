#use an official Node.js runtime as th base image
FROM node:20

#set the working directory in the container
WORKDIR ../api

#copy package.json and package-lock.json to the container
COPY package*.json ./

#install app dependecies
RUN npm install

#copy your application code into the container
COPY . .

#expose a port for your Node.js app 
EXPOSE 9000

#Start the application
CMD ["npm","start"]