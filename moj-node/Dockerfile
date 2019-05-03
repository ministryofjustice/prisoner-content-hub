FROM node:10.15.3-alpine

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE

# Create app directory
WORKDIR /home/node/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . /home/node/app

# Add curl
RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

# Generate styles
RUN ./node_modules/node-sass/bin/node-sass $@ \
  --include-path node_modules/govuk_frontend_toolkit/stylesheets \
  --include-path node_modules/govuk_template_jinja/assets/stylesheets \
  --include-path node_modules/govuk-elements-sass/public/sass \
  /home/node/app/assets/sass/style.scss \
  /home/node/app/assets/stylesheets/application.css

# Run application verification
RUN npm run verify

# Record build number
RUN BUILD_NUMBER=${BUILD_NUMBER} GIT_REF=${GIT_REF} GIT_DATE=${GIT_DATE} npm run record-build-info

EXPOSE 3000
CMD [ "npm", "start" ]
