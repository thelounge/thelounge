"use strict";

const i18n = require("i18next");
const i18nXHR = require("i18next-xhr-backend");
const $ = require("jquery");

module.exports = {
	init: function(data, socket) {
		const opts =
			{
				// path where resources get loaded from, or a function
				// returning a path:
				// function(lngs, namespaces) { return customPath; }
				// the returned path will interpolate lng, ns if provided like giving a static path
				loadPath: "locales/{{lng}}.json",
				// allow cross domain requests
				crossDomain: false,

				// allow credentials on cross domain requests
				withCredentials: false
			};
		i18n
			.use(i18nXHR)
			.init({
				backend: opts,
				lng: data.lang, debug: true, load: "currentOnly"
			}, function() {
				// Only start opening socket.io connection after all events have been registered
				socket.open();

				// Translate text in index.html
				$("[aria-label]").attr("aria-label", function(i, val) {
					return i18n.t(val);
				});

				$("[placeholder]").attr("placeholder", function(i, val) {
					return i18n.t(val);
				});

				$("[data-text-alternate]").attr("data-text-alternate", function(i, val) {
					return i18n.t(val);
				});

				$("[data-translate]").attr("data-translate", function() {
					$(this).html(i18n.t($(this).text().trim(), {interpolation: {escapeValue: false}}));
				});
			});
	},
	translate: function(key, options) {
		return i18n.t(key, options);
	},
	changeLanguage: function(lang) {
		if (i18n) {
			i18n.changeLanguage(lang); // doesn't actually do anything when changing from Settings
			location.reload();
		}
	}
};
