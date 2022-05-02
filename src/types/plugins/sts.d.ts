type PolicyOption = {
	port: number;
	duration: number;
	expires: number;
	host: string;
};

export type PolicyMap = Map<string, Omit<PolicyOption, "host">>;
