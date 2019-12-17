#!/bin/bash

cd node_modules
rm -rf react
ln -s ../../docere/node_modules/react react

cd @types
rm -rf react
ln -s ../../../docere/node_modules/@types/react react
