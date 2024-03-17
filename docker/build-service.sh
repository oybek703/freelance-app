#!/bin/bash

cp ../package-lock.json ../apps/"$1"

nx build "$1"
