module.exports = {
	//
	// Set the server mode.
	// Public servers does not require authentication.
	//
	// Set to 'false' to enable users.
	//
	// @type     boolean
	// @default  true
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
	// To listen on all IPs, set to undefined.
	//
	// @type     string
	// @default  undefined
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
	// If enabled, The Lounge will try to load thumbnails and site descriptions from
	// URLs posted in channels.
	//
	// @type     boolean
	// @default  false
	//
	prefetch: false,

	//
	// Prefetch URLs Image Preview size limit
	//
	// If prefetch is enabled, The Lounge will only display content under the maximum size.
	// Default value is 512 (in kB)
	//
	// @type     int
	// @default  512
	//
	prefetchMaxImageSize: 512,

	//
	// Display network
	//
	// If set to false network settings will not be shown in the login form.
	//
	// @type     boolean
	// @default  true
	//
	displayNetwork: true,

	//
	// Lock network
	//
	// If set to true, users will not be able to modify host, port and tls
	// settings and will be limited to the configured network.
	//
	// @type     boolean
	// @default  false
	//
	lockNetwork: false,

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
	// Maximum number of history lines per channel
	//
	// Defines the maximum number of history lines that will be kept in
	// memory per channel/query, in order to reduce the memory usage of
	// the server. Negative means unlimited.
	//
	// @type     integer
	// @default  -1
	maxHistory: -1,

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
		// @default  "chat.freenode.net"
		//
		host: "chat.freenode.net",

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
		// @default  "lounge-user"
		//
		nick: "lounge-user",

		//
		// Username
		//
		// @type     string
		// @default  "lounge-user"
		//
		username: "lounge-user",

		//
		// Real Name
		//
		// @type     string
		// @default  "The Lounge User"
		//
		realname: "The Lounge User",

		//
		// Channels
		// This is a comma-separated list.
		//
		// @type     string
		// @default  "#thelounge"
		//
		join: "#thelounge"
	},

	//
	// Set socket.io transports
	//
	// @type     array
	// @default  ["polling", "websocket"]
	//
	transports: ["polling", "websocket"],

	//
	// Run The Lounge using encrypted HTTP/2.
	// This will fallback to regular HTTPS if HTTP/2 is not supported.
	//
	// @type     object
	// @default  {}
	//
	https: {
		//
		// Enable HTTP/2 / HTTPS support.
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
	// Run The Lounge with identd support.
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
