#!/usr/bin/env bash

cd ./build || exit

jsFiles=$(find . -name "*.js")

echo "$jsFiles" | while read -r line; do
  echo "> Building file ${line%.*}.js"
  sed -re 's/(import.*\"\/.*)\"/\1\.js\"/g' "$line" > "${line%.*}.js"
done

cd - || exit
