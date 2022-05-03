type Config = {
	public: boolean;
	host: string | undefined;
	port: number;
	bind: string | undefined;
	reverseProxy: boolean;
	maxHistory: number;
	https: Https;
	theme: string;
	prefetch: boolean;
	disableMediaPreview: boolean;
	prefetchStorage: boolean;
	prefetchMaxImageSize: number;
	prefetchMaxSearchSize: number;
	prefetchTimeout: number;
	fileUpload: FileUpload;
	transports: string[];
	leaveMessage: string;
	defaults: Defaults;
	lockNetwork: boolean;
	messageStorage: string[];
	useHexIp: boolean;
	webirc?: WebIRC;
	identd: Identd;
	oidentd?: string;
	ldap: Ldap;
	debug: Debug;
	themeColor: string;
};

type ClientConfiguration = Pick<
	Config,
	"public" | "lockNetwork" | "useHexIp" | "prefetch" | "defaults"
> & {
	fileUpload: boolean;
	ldapEnabled: boolean;
	isUpdateAvailable: boolean;
	applicationServerKey: string;
	version: string;
	gitCommit: string | null;
	defaultTheme: string;
	themes: ThemeForClient[];
	defaults: Defaults & {
		sasl?: string;
		saslAccount?: string;
		saslPassword?: string;
	};
	fileUploadMaxFileSize?: number;
};

type ServerConfiguration = Config & {
	stylesheets: string[];
};

type IndexTemplateConfiguration = ServerConfiguration & {
	cacheBust: string;
};

// TODO: Type this
type WebIRC = {
	[key: string]: any;
};

type Https = {
	enable: boolean;
	key: string;
	certificate: string;
	ca: string;
};

export type FileUpload = {
	enable: boolean;
	maxFileSize: number;
	baseUrl?: string;
};

export type Defaults = {
	name: string;
	host: string;
	port: number;
	password: string;
	tls: boolean;
	rejectUnauthorized: boolean;
	nick: string;
	username: string;
	realname: string;
	join: string;
	leaveMessage: string;
};

export type Identd = {
	enable: boolean;
	port: number;
};

export type Ldap = {
	enable: boolean;
	url: string;
	tlsOptions: any;
	primaryKey: string;
	searchDN: SearchDN;
	baseDN?: string;
};

export type TlsOptions = any;

export type SearchDN = {
	rootDN: string;
	rootPassword: string;
	filter: string;
	base: string;
	scope: string;
};

export type Debug = {
	ircFramework: boolean;
	raw: boolean;
};
