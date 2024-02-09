#!/bin/sh
OPSMAP_DATASET_ROOT_DIR=https://raw.githubusercontent.com/GDS-ODSSS/opsmaps//main/
ROOT_DIR=/var/www/html/;
OPSMAP_DIR=/var/www/html/readonly;

# copy opsmap content - ready to be edited
cp -rf $OPSMAP_DIR/* $ROOT_DIR

cd $ROOT_DIR;

for opsmap in */ ; do
    echo "$opsmap"

    OPSMAP_ROOT_DIR=$ROOT_DIR$opsmap

    for file in $OPSMAP_ROOT_DIR/js/*.js* $OPSMAP_ROOT_DIR/index.html ; do
        if test -f "$file"; then
            sed -i 's|VUE_APP_AFTERBUILDENV_GENERAL_CONFIG_DIRECTORY|'${OPSMAP_DATASET_ROOT_DIR}${opsmap}'/|g' $file
            sed -i 's|VUE_APP_AFTERBUILDENV_RIDL_TOKEN|'${VUE_APP_RIDL_TOKEN}'|g' $file
        fi
    done
done

# Starting NGINX
nginx -g 'daemon off;'