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
	// Set the local IP to bind to.
	//
	// @type     string
	// @default  "0.0.0.0"
	//
	bind: undefined,

	//
	// Set the default theme.
	//
	// @type     string
	// @default  "themes/example.css"
	//
	theme: "themes/example.css",

	//
	// Autoload users
	//
	// When this setting is enabled, your 'users/' folder will be monitored. This is useful
	// if you want to add/remove users while the server is running.
	//
	// @type     boolean
	// @default  true
	//
	autoload: true,

	//
	// Prefetch URLs
	//
	// If enabled, Shout will try to load thumbnails and site descriptions from
	// URLs posted in channels.
	//
	// @type     boolean
	// @default  true
	//
	prefetch: false,

	//
	// Display network
	//
	// If set to false Shout will not expose network settings in login
	// form, limiting client to connect to the configured network.
	//
	// @type     boolean
	// @default  true
	//
	displayNetwork: true,

	//
	// Log settings
	//
	// Logging has to be enabled per user. If enabled, logs will be stored in
	// the '/users/<user>/logs/' folder.
	//
	// @type     object
	// @default  {}
	//
	logs: {
		//
		// Timestamp format
		//
		// @type     string
		// @default  "YYYY-MM-DD HH:mm:ss"
		//
		format: "YYYY-MM-DD HH:mm:ss",

		//
		// Timezone
		//
		// @type     string
		// @default  "UTC+00:00"
		//
		timezone: "UTC+00:00"
	},

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
		// Username
		//
		// @type     string
		// @default  "shout-user"
		//
		username: "shout-user",

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
	},

	//
	// Set socket.io transports
	//
	// @type     array
	// @default  ["polling', "websocket"]
	//
	transports: ["polling", "websocket"],

	//
	// Run Shout with HTTPS support.
	//
	// @type     object
	// @default  {}
	//
	https: {
		//
		// Enable HTTPS support.
		//
		// @type     boolean
		// @default  false
		//
		enable: false,

		//
		// Path to the key.
		//
		// @type     string
		// @example  "sslcert/key.pem"
		// @default  ""
		//
		key: "",

		//
		// Path to the certificate.
		//
		// @type     string
		// @example  "sslcert/key-cert.pem"
		// @default  ""
		//
		certificate: ""
	},

	//
	// Run Shout with identd support.
	//
	// @type     object
	// @default  {}
	//
	identd: {
		//
		// Run the identd daemon on server start.
		//
		// @type     boolean
		// @default  false
		//
		enable: false,

		//
		// Port to listen for ident requests.
		//
		// @type     int
		// @default  113
		//
		port: 113
	}
};
