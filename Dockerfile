FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install --verbose
COPY . /app
ARG configuration=''
RUN npx ng build --configuration=$configuration

FROM nginx:1.19.2 as nginx
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'