#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "No pull request ID was specified."
  exit 1
fi

git fetch https://github.com/thelounge/lounge.git refs/pull/${1}/head
git checkout FETCH_HEAD
git rebase master
npm install
NODE_ENV=production npm run build
npm test || true
npm start
