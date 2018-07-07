FROM node:9.11.1-alpine
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
# Generate styles
RUN ./node_modules/node-sass/bin/node-sass $@ \
    --include-path node_modules/govuk_frontend_toolkit/stylesheets \
    --include-path node_modules/govuk_template_jinja/assets/stylesheets \
    --include-path node_modules/govuk-elements-sass/public/sass \
    /home/node/app/assets/sass/style.scss \
    /home/node/app/assets/stylesheets/application.css
EXPOSE 3000
CMD [ "npm", "start" ]