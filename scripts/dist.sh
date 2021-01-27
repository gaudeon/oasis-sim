#!/usr/bin/env bash

rm -rf dist/; BUILD_DEV=false 

npm run packfiles

cd dist

zip -r oasis-sim-latest.zip *
