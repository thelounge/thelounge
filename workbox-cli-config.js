module.exports = {
  "globDirectory": "client/",
  "globPatterns": [
    "**/*.{ogg,css,txt,woff,woff2,png,svg,html,map,json}"
  ],
  "swDest": "./client/js/libs/sw.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ]
};
