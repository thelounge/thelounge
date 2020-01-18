// Loosely based on https://github.com/exif-js/exif-js
// But made to work with node.js instead of in a browser
// and also works with arbitrary bytestreams

const log = require("../log");

function readTag(buffer, entryOffset) {
	const type = buffer.readUInt16(entryOffset + 2),
		numValues = buffer.readUInt32(entryOffset + 4);

	switch (type) {
		case 1: // byte, 8-bit unsigned int
		case 7: // undefined, 8-bit byte, value depending on field
			if (numValues === 1) {
				return buffer.readUInt8(entryOffset + 8);
			}

			return false;

		case 3: // short, 16 bit int
			if (numValues === 1) {
				return buffer.readUInt16(entryOffset + 8);
			}

			return false;

		case 4: // long, 32 bit int
			if (numValues === 1) {
				return buffer.readUInt32(entryOffset + 8);
			}

			return false;

		case 9: // slong, 32 bit signed int
			if (numValues === 1) {
				return buffer.readInt32(entryOffset + 8);
			}

			return false;
	}
}

function readOrientation(buffer, tiffStart, dirStart) {
	const entries = buffer.readUInt16(dirStart);

	for (let i = 0; i < entries; i++) {
		const entryOffset = dirStart + i * 12 + 2;

		if (buffer.readUInt16(entryOffset) === 0x0112) {
			return readTag(buffer, entryOffset, tiffStart);
		}
	}

	return false;
}

module.exports = class ExifOrientationParser {
	constructor() {
		this.isJpeg = null;
		this.lastbyte = null;
		this.foundMarker = false;
		this.buffer = null;
		this.markerOffset = 0;
		this.result = null;
	}

	parseChunk(chunk) {
		if (this.result !== null) {
			return this.result;
		}

		if (this.isJpeg === false) {
			throw new Error("Not a valid JPEG file");
		}

		if (this.isJpeg) {
			return this.findData(chunk);
		}

		if (this.lastbyte === null) {
			this.lastbyte = chunk[0];
			chunk = chunk.slice(1);
		}

		if (chunk.length) {
			if (this.lastbyte !== 0xff || chunk[0] !== 0xd8) {
				throw new Error("Not a valid JPEG file");
			}

			this.lastbyte = null;
			this.isJpeg = true;

			if (chunk.length > 1) {
				return this.findData(chunk.slice(1));
			}
		}

		return null;
	}

	findData(chunk) {
		if (!this.foundMarker) {
			return this.findMarker(chunk);
		}

		if (this.buffer === null) {
			return this.readSize(chunk);
		}

		if (this.markerOffset < this.buffer.length) {
			this.markerOffset += chunk.copy(
				this.buffer,
				this.markerOffset,
				0,
				Math.min(chunk.length, this.buffer.length - this.markerOffset)
			);

			if (this.markerOffset === this.buffer.length) {
				return (this.result = this.readEXIFData());
			}
		}

		return null;
	}

	findMarker(chunk) {
		if (this.lastbyte === null) {
			this.lastbyte = chunk[0];
			chunk = chunk.slice(1);
		}

		let offset = 0;

		while (offset < chunk.length) {
			if (this.lastbyte === 0xff && chunk[offset] === 0xe1) {
				this.foundMarker = true;
				this.reading = true;
				this.lastbyte = null;
				offset++;

				if (chunk.length > offset) {
					return this.parseChunk(chunk.slice(offset));
				}

				return null;
			}

			this.lastbyte = chunk[offset++];
		}

		return null;
	}

	readSize(chunk) {
		if (this.lastbyte === null) {
			this.lastbyte = chunk[0];
			chunk = chunk.slice(1);
		}

		if (chunk.length) {
			// the 2 bytes declaring the size, is part of the size calculation
			// removing 2 means we get the size of the buffer we need to allocate
			const size = ((chunk[0] << 8) | this.lastbyte) - 2;
			this.lastbyte = null;
			this.buffer = Buffer.alloc(size);

			if (chunk.length > 1) {
				return this.parseChunk(chunk.slice(1));
			}
		}

		return null;
	}

	readEXIFData() {
		if (this.buffer.toString("utf-8", 0, 4) !== "Exif") {
			log.debug("Not valid EXIF data! " + this.buffer.toString("hex", 0, 4));
			return false;
		}

		const buffer = this.buffer.slice(6);

		// test for TIFF validity and endianness
		if (buffer.readUInt16LE(0) === 0x4949) {
			buffer.readUInt16 = buffer.readUInt16LE;
			buffer.readInt16 = buffer.readInt16LE;
			buffer.readUInt32 = buffer.readUInt32LE;
			buffer.readInt32 = buffer.readInt32LE;
		} else if (buffer.readUInt16BE(0) === 0x4d4d) {
			buffer.readUInt16 = buffer.readUInt16BE;
			buffer.readInt16 = buffer.readInt16BE;
			buffer.readUInt32 = buffer.readUInt32BE;
			buffer.readInt32 = buffer.readInt32BE;
		} else {
			log.debug("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
			return false;
		}

		if (buffer.readUInt16(2) !== 0x002a) {
			log.debug("Not valid TIFF data! (no 0x002A)");
			return false;
		}

		const IFDOffset = buffer.readUInt32(4);

		if (IFDOffset < 0x00000008) {
			log.debug("Not valid TIFF data! (First offset less than 8)", buffer.readUInt32(4));

			return false;
		}

		return readOrientation(buffer, 0, IFDOffset);
	}
};
