#!/bin/bash

#
# This file will compile the javascript libraries and
# the Handlebars templates.
#

# Install Handlebars
if ! type handlebars &> /dev/null; then
	sudo npm -g install handlebars
fi

# Compile the templates
handlebars -e tpl -f client/js/shout.templates.js client/views/

# Uglify the javascript libraries
# See: Gruntfile.js
grunt uglify
