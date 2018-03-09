"use strict";

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
	public: false,

	//
	// IP address or hostname for the web server to listen on.
	// Setting this to undefined will listen on all interfaces.
	//
	// For UNIX domain sockets, use unix:/absolute/path/to/file.sock.
	//
	// @type     string
	// @default  undefined
	//
	host: undefined,

	//
	// Set the port to listen on.
	//
	// @type     int
	// @default  9000
	//
	port: 9000,

	//
	// Set the local IP to bind to for outgoing connections. Leave to undefined
	// to let the operating system pick its preferred one.
	//
	// @type     string
	// @default  undefined
	//
	bind: undefined,

	//
	// Sets whether the server is behind a reverse proxy and should honor the
	// X-Forwarded-For header or not.
	//
	// @type     boolean
	// @default  false
	//
	reverseProxy: false,

	//
	// Set the default theme.
	// Find out how to add new themes at https://thelounge.github.io/docs/plugins/themes.html
	//
	// @type     string
	// @default  "example"
	//
	theme: "example",

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
	// Store and proxy prefetched images and thumbnails.
	// This improves security and privacy by not exposing client IP address,
	// and always loading images from The Lounge instance and making all assets secure,
	// which in result fixes mixed content warnings.
	//
	// If storage is enabled, The Lounge will fetch and store images and thumbnails
	// in the `${THELOUNGE_HOME}/storage` folder.
	//
	// Images are deleted when they are no longer referenced by any message (controlled by maxHistory),
	// and the folder is cleaned up on every The Lounge restart.
	//
	// @type     boolean
	// @default  false
	//
	prefetchStorage: false,

	//
	// Prefetch URLs Image Preview size limit
	//
	// If prefetch is enabled, The Lounge will only display content under the maximum size.
	// Specified value is in kilobytes. Default value is 2048 kilobytes.
	//
	// @type     int
	// @default  2048
	//
	prefetchMaxImageSize: 2048,

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
	// Hex IP
	//
	// If enabled, clients' username will be set to their IP encoded has hex.
	// This is done to share the real user IP address with the server for host masking purposes.
	//
	// @type     boolean
	// @default  false
	//
	useHexIp: false,

	//
	// WEBIRC support
	//
	// If enabled, The Lounge will pass the connecting user's host and IP to the
	// IRC server. Note that this requires to obtain a password from the IRC network
	// The Lounge will be connecting to and generally involves a lot of trust from the
	// network you are connecting to.
	//
	// Format (standard): {"irc.example.net": "hunter1", "irc.example.org": "passw0rd"}
	// Format (function):
	//   {"irc.example.net": function(client, args, trusted) {
	//       // here, we return a webirc object fed directly to `irc-framework`
	//       return {username: "thelounge", password: "hunter1", address: args.ip, hostname: "webirc/"+args.hostname};
	//   }}
	//
	// @type     string | function(client, args):object(webirc)
	// @default  null
	webirc: null,

	//
	// Message logging
	// Logging is also controlled per user individually (logs variable)
	// Leave the array empty to disable all logging globally
	//
	// text: Text file per network/channel in user folder
	// sqlite: Messages are stored in SQLite, this allows them to be reloaded on server restart
	//
	// @type     array
	// @default  ["sqlite", "text"]
	//
	messageStorage: ["sqlite", "text"],

	//
	// Log settings
	//
	// Logging has to be enabled per user. If enabled, logs will be stored in
	// the 'logs/<user>/<network>/' folder.
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
		timezone: "UTC+00:00",
	},

	//
	// Maximum number of history lines per channel
	//
	// Defines the maximum number of history lines that will be kept in
	// memory per channel/query, in order to reduce the memory usage of
	// the server. Setting this to -1 will keep unlimited amount.
	//
	// @type     integer
	// @default  10000
	maxHistory: 10000,

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
		// Enable certificate verification
		//
		// If true, the server certificate is verified against
		// the list of supplied CAs by your node.js installation.
		//
		// @type     boolean
		// @default  true
		//
		rejectUnauthorized: true,

		//
		// Nick
		//
		// Percent sign (%) will be replaced into a random number from 0 to 9.
		// For example, Guest%%% will become Guest123 on page load.
		//
		// @type     string
		// @default  "thelounge%%"
		//
		nick: "thelounge%%",

		//
		// Username
		//
		// @type     string
		// @default  "thelounge"
		//
		username: "thelounge",

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
		join: "#thelounge",
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
		certificate: "",

		//
		// Path to the CA bundle.
		//
		// @type     string
		// @example  "sslcert/bundle.pem"
		// @default  ""
		//
		ca: "",
	},

	//
	// Default quit and part message if none is provided.
	//
	// @type     string
	// @default  "The Lounge - https://thelounge.chat"
	//
	leaveMessage: "The Lounge - https://thelounge.chat",

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
		port: 113,
	},

	//
	// Enable oidentd support using the specified file
	//
	// Example: oidentd: "~/.oidentd.conf",
	//
	// @type     string
	// @default  null
	//
	oidentd: null,

	//
	// LDAP authentication settings (only available if public=false)
	// @type    object
	// @default {}
	//
	// The authentication process works as follows:
	//
	//   1. Lounge connects to the LDAP server with its system credentials
	//   2. It performs a LDAP search query to find the full DN associated to the
	//      user requesting to log in.
	//   3. Lounge tries to connect a second time, but this time using the user's
	//      DN and password. Auth is validated iff this connection is successful.
	//
	// The search query takes a couple of parameters in `searchDN`:
	//   - a base DN `searchDN/base`. Only children nodes of this DN will be likely
	//     to be returned;
	//   - a search scope `searchDN/scope` (see LDAP documentation);
	//   - the query itself, build as (&(<primaryKey>=<username>) <filter>)
	//     where <username> is the user name provided in the log in request,
	//     <primaryKey> is provided by the config and <fitler> is a filtering complement
	//     also given in the config, to filter for instance only for nodes of type
	//     inetOrgPerson, or whatever LDAP search allows.
	//
	// Alternatively, you can specify the `bindDN` parameter. This will make the lounge
	// ignore searchDN options and assume that the user DN is always:
	//     <bindDN>,<primaryKey>=<username>
	// where <username> is the user name provided in the log in request, and <bindDN>
	// and <primaryKey> are provided by the config.
	//
	ldap: {
		//
		// Enable LDAP user authentication
		//
		// @type     boolean
		// @default  false
		//
		enable: false,

		//
		// LDAP server URL
		//
		// @type     string
		//
		url: "ldaps://example.com",

		//
		// LDAP connection tls options (only used if scheme is ldaps://)
		//
		// @type     object (see nodejs' tls.connect() options)
		// @default {}
		//
		// Example:
		//   You can use this option in order to force the use of IPv6:
		//   {
		//     host: 'my::ip::v6',
		//     servername: 'example.com'
		//   }
		tlsOptions: {},

		//
		// LDAP base dn, alternative to searchDN
		//
		// @type     string
		//
		// baseDN: "ou=accounts,dc=example,dc=com",

		//
		// LDAP primary key
		//
		// @type     string
		// @default  "uid"
		//
		primaryKey: "uid",

		//
		// LDAP search dn settings. This defines the procedure by which the
		// lounge first look for user DN before authenticating her.
		// Ignored if baseDN is specified
		//
		// @type     object
		//
		searchDN: {

			//
			// LDAP searching bind DN
			// This bind DN is used to query the server for the DN of the user.
			// This is supposed to be a system user that has access in read only to
			// the DNs of the people that are allowed to log in.
			//
			// @type     string
			//
			rootDN: "cn=thelounge,ou=system-users,dc=example,dc=com",

			//
			// Password of the lounge LDAP system user
			//
			// @type     string
			//
			rootPassword: "1234",

			//
			// LDAP filter
			//
			// @type     string
			// @default  "uid"
			//
			filter: "(objectClass=person)(memberOf=ou=accounts,dc=example,dc=com)",

			//
			// LDAP search base (search only within this node)
			//
			// @type     string
			//
			base: "dc=example,dc=com",

			//
			// LDAP search scope
			//
			// @type     string
			// @default  "sub"
			//
			scope: "sub",

		},
	},

	// Extra debugging
	//
	// @type     object
	// @default  {}
	//
	debug: {
		// Enables extra debugging output provided by irc-framework.
		//
		// @type     boolean
		// @default  false
		//
		ircFramework: false,

		// Enables logging raw IRC messages into each server window.
		//
		// @type     boolean
		// @default  false
		//
		raw: false,
	},
};
