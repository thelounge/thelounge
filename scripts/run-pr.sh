#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "No pull request ID was specified."
  exit 1
fi

git fetch https://github.com/thelounge/thelounge.git refs/pull/${1}/head
git checkout FETCH_HEAD
git rebase master
yarn install
NODE_ENV=production yarn build
yarn test || true
shift
yarn start "$@"
