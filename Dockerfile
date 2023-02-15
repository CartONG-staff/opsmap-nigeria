FROM alpine:3.12

ARG opsmap

RUN apk --no-cache add nginx npm supervisor && \
  rm /etc/nginx/conf.d/default.conf

RUN addgroup -S node && adduser -S node -G node


# Configure nginx
COPY config-docker/opsmap-nginx.conf /etc/nginx/nginx.conf
COPY config-docker/opsmap-supervisord.conf etc/supervisor/conf.d/supervisord.conf

# Setup document root
RUN mkdir -p /var/www/html && mkdir "/var/www/html/.npm/"
# Make sure files/folders needed by the processes are accessable when they run under the node user
RUN chown -R node.node /var/www/html && \
  chown -R node.node /run && \
  chown -R node.node /var/lib/nginx && \
  chown -R node.node /var/log/nginx && \
  chown -R node:node /var/www/html

# # Handle 
# RUN mkdir -p /usr/lib/node_modules &&\
#   chown -R node.node /usr/lib/node_modules 

# Switch to use a non-root user from here on
USER node

# Add application

COPY --chown=node ./ /var/www/html/

WORKDIR /var/www/html/
RUN ls -la /var/www/html/

# RUN chown -R node:node ./package.json
# RUN chown -R 65534:65534 "/.npm"
RUN npm ci --no-progress --no-audit --legacy-peer-deps

ENV NODE_ENV production

# Build
RUN npm run build -- --mode $opsmap

# Clean up files 
RUN mkdir -p /var/www/html
RUN mkdir -p /var/www/html/.npm/

RUN cp -r /var/www/html/dist/data/$opsmap /var/www/html/dist
RUN rm -rf /var/www/html/dist/data/*
RUN mv /var/www/html/dist/$opsmap /var/www/html/dist/data/
RUN rm -rf /var/www/html/public
RUN rm -rf /var/www/html/src
RUN rm -rf /var/www/html/tests

# Expose the port nginx is reachable on
EXPOSE 8080

WORKDIR /var/www/html/

# Let supervisord start nginx & php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

