type RequiredNotNull<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

type Ensure<T, K extends keyof T> = T & RequiredNotNull<Pick<T, K>>;
