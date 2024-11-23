FROM node:alpine

WORKDIR /app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install && npm cache clean --force

COPY . /app/

EXPOSE 3001

CMD ["node", "index.js"]