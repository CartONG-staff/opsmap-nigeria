FROM alpine:3.12

ARG opsmaps

RUN apk --no-cache add nginx npm supervisor && \
  rm /etc/nginx/conf.d/default.conf

RUN addgroup -S node && adduser -S node -G node

# Configure nginx
COPY config-docker/opsmap-nginx.conf /etc/nginx/nginx.conf
COPY config-docker/opsmap-supervisord.conf etc/supervisor/conf.d/supervisord.conf

# Setup document root
RUN mkdir -p /var/www/html/

# Setup build root
RUN mkdir -p /var/www/html/build/.npm/

# Make sure files/folders needed by the processes are accessable when they run under the node user
RUN chown -R node.node /var/www/html && \
  chown -R node.node /run && \
  chown -R node.node /var/lib/nginx && \
  chown -R node.node /var/log/nginx && \
  chown -R node:node /var/www/html

# Switch to use a non-root user from here on
USER node

# Add application
COPY --chown=node ./ /var/www/html/build

WORKDIR /var/www/html/build

# #############################################################################
# Build the app
# #############################################################################

# npm install -- all 
RUN npm ci --no-progress --no-audit --legacy-peer-deps

# npm build -- production mode
ENV NODE_ENV production
RUN npm run build -- --mode dockerized

# #############################################################################
# Set up
# #############################################################################

WORKDIR /var/www/html/

# Build
RUN for opsmap in $opsmaps; do \
  echo "$opsmap"; \
  # create opsmap directory
  mkdir -p /var/www/html/"$opsmap"; \
  \
  # copy app
  cp -r /var/www/html/build/dist/img /var/www/html/"$opsmap"; \
  cp -r /var/www/html/build/dist/js /var/www/html/"$opsmap"; \
  cp /var/www/html/build/dist/favicon.ico /var/www/html/"$opsmap"; \
  cp /var/www/html/build/dist/index.html /var/www/html/"$opsmap"; \
  \
  # upadte the data dir. This path must match the one in the .env file
  mv /var/www/html/build/dist/data/"$opsmap" /var/www/html/"$opsmap"/data; \
  done;

# #############################################################################
# Clean the build
# #############################################################################

RUN rm -rf /var/www/html/build

# #############################################################################
# Expose nginx ports
# #############################################################################

# Expose the port nginx is reachable on
EXPOSE 8891
EXPOSE 8892

WORKDIR /var/www/html/

# Let supervisord start nginx & php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

