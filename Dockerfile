FROM node:20
ENV TZ="Europe/Amsterdam"

WORKDIR /src/
COPY ./ /src/
RUN npm install

USER node

ENTRYPOINT [ "node", "/src/app.js" ]