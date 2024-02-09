FROM node:17
WORKDIR /opt/matchmaker
COPY ./frontend ./frontend
WORKDIR /opt/matchmaker/frontend
RUN npm i && npm run build
WORKDIR /opt/matchmaker
COPY /backend .
RUN cp -R ./frontend/build ./public
RUN npm i
EXPOSE 4000
ENTRYPOINT [ "node", "index.js" ]