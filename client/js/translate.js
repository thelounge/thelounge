"use strict";

const i18nXHR = require("i18next-xhr-backend");
let i18nInst = null;
module.exports = {
	init: function(options, i18n) {
		i18nInst = i18n;
		const opts =
			{
				// path where resources get loaded from, or a function
				// returning a path:
				// function(lngs, namespaces) { return customPath; }
				// the returned path will interpolate lng, ns if provided like giving a static path
				loadPath: "translations/{{lng}}.json",

				// allow cross domain requests
				crossDomain: false,

				// allow credentials on cross domain requests
				withCredentials: false,
			};
		i18n
			.use(i18nXHR)
			.init({
				backend: opts,
				lng: options.lang, debug: true, load: "all",
				fallbackLng: ["en", "fr"],
			});
	},
	translate: function(key, options) {
		return i18nInst.t(key, options);
	},
	changeLanguage: function(lang) {
		if (i18nInst) {
			location.reload();
		}
	}
};

