#!/bin/bash

npm install
npm install typescript --save-dev
npm install react-scripts --save
npm run build
npm install -g serve && serve -s build
