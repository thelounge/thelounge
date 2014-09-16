module.exports = {
	//
	// Set the server mode.
	// Public servers does not require authentication.
	//
	// Set to 'false' to enable users.
	//
	// @type     boolean
	// @default  false
	//
	public: true,

	//
	// Allow connections from this host.
	//
	// @type     string
	// @default  "0.0.0.0"
	//
	host: "0.0.0.0",

	//
	// Set the port to listen on.
	//
	// @type     int
	// @default  9000
	//
	port: 9000,

	//
	// Set the default theme.
	//
	// @type     string
	// @default  "themes/example.css"
	//
	theme: "themes/example.css",

	//
	// Override home directory.
	// Leaving this field empty will default to '~/.shout/'.
	//
	// @type     string
	// @default  ""
	//
	home: "",

	//
	// Enable debug mode.
	// This is only useful for development.
	//
	// @type     boolean
	// @default  false
	//
	debug: false,

	//
	// Default values for the 'Connect' form.
	//
	// @type     object
	// @default  {}
	//
	defaults: {
		//
		// Name
		//
		// @type     string
		// @default  "Freenode"
		//
		name: "Freenode",

		//
		// Host
		//
		// @type     string
		// @default  "irc.freenode.org"
		//
		host: "irc.freenode.org",

		//
		// Port
		//
		// @type     int
		// @default  6697
		//
		port: 6697,

		//
		// Password
		//
		// @type     string
		// @default  ""
		//
		password: "",

		//
		// Enable TLS/SSL
		//
		// @type     boolean
		// @default  true
		//
		tls: true,

		//
		// Nick
		//
		// @type     string
		// @default  "shout-user"
		//
		nick: "shout-user",

		//
		// Real Name
		//
		// @type     string
		// @default  "Shout User"
		//
		realname: "Shout User",

		//
		// Channels
		//
		// @type     string
		// @default  "#foo, #shout-irc"
		//
		join: "#foo, #shout-irc"
	}
};
