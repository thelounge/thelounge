export type SharedChangelogData = {
	current: {
		prerelease: boolean;
		version: string;
		changelog?: string;
		url: string;
	};
	expiresAt: number;
	latest?: {
		prerelease: boolean;
		version: string;
		url: string;
	};
	packages?: boolean;
};
