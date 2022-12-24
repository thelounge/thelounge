const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

export default function formatSize(size: number): string {
	if (size <= 0) {
		throw new Error("Size must be a positive number");
	}

	const i = Math.floor(Math.log(size) / Math.log(1024));

	if (i >= sizes.length) {
		throw new Error("Size is out of range");
	}

	return `${(size / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
