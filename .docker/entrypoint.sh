#!/bin/bash

cd /home/node/app

npm install

if [ ! -z "$PROD" ]; then
    # nodemon -L
    echo "passou"
fi
