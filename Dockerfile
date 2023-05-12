From node:18.4.0-alpine

# Install Python, pip and dependencies
RUN apk add --no-cache python3 python3-dev py3-pip
 
RUN pip3 install --no-cache-dir numpy PuLP pandas \
    && apk del .build-deps

WORKDIR /backend

COPY package*.json ./

# Install Node Dependencies
RUN npm install

COPY . .

CMD ["node", "index.js"]