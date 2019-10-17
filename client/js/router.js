"use strict";

const Vue = require("vue").default;
const VueRouter = require("vue-router").default;
Vue.use(VueRouter);

const SignIn = require("../components/Windows/SignIn.vue").default;
const Connect = require("../components/Windows/Connect.vue").default;
const Settings = require("../components/Windows/Settings.vue").default;
const Help = require("../components/Windows/Help.vue").default;
const Changelog = require("../components/Windows/Changelog.vue").default;
const RoutedChat = require("../components/RoutedChat.vue").default;

const router = new VueRouter({
	routes: [
		{path: "/sign-in", component: SignIn},
		{path: "/connect", component: Connect},
		{path: "/settings", component: Settings},
		{path: "/help", component: Help},
		{path: "/changelog", component: Changelog},
		{path: "/chan-*", component: RoutedChat},
	],
});

export default router;
