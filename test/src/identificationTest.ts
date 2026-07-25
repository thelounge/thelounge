import {expect} from "chai";
import {Socket} from "net";
import Identification, {normalizeAddress} from "../../server/identification";

function fakeSocket(props: Partial<Socket>): Socket {
	return props as unknown as Socket;
}

describe("Identification", function () {
	describe("#normalizeAddress", function () {
		it("strips the IPv4-mapped IPv6 prefix", function () {
			expect(normalizeAddress("::ffff:127.0.0.1")).to.equal("127.0.0.1");
			expect(normalizeAddress("::ffff:198.51.100.10")).to.equal("198.51.100.10");
		});

		it("leaves plain IPv4 addresses untouched", function () {
			expect(normalizeAddress("127.0.0.1")).to.equal("127.0.0.1");
		});

		it("leaves genuine IPv6 addresses untouched", function () {
			expect(normalizeAddress("::1")).to.equal("::1");
			expect(normalizeAddress("2001:db8::1")).to.equal("2001:db8::1");
		});

		it("does not strip the prefix from non-IPv4 payloads", function () {
			expect(normalizeAddress("::ffff:dead:beef")).to.equal("::ffff:dead:beef");
		});

		it("passes undefined through", function () {
			expect(normalizeAddress(undefined)).to.equal(undefined);
		});
	});

	describe("#respondToIdent", function () {
		// The IRC server queries identd with "<our local port>, <server port>"
		const query = Buffer.from("12345, 6697\r\n");

		function respond(querySocket: Partial<Socket>, connectionSocket: Partial<Socket>) {
			const ident = new Identification(() => {});
			ident.addSocket(fakeSocket(connectionSocket), "alice");

			let reply = "";
			const socket = fakeSocket({
				...querySocket,
				write: ((data: string) => {
					reply += data;
					return true;
				}) as Socket["write"],
			});

			ident.respondToIdent(socket, query);
			return reply;
		}

		it("matches when the listener reports an IPv4-mapped address but the connection is plain IPv4", function () {
			const reply = respond(
				{
					remoteAddress: "::ffff:198.51.100.10",
					localAddress: "::ffff:203.0.113.5",
				},
				{
					remoteAddress: "198.51.100.10",
					remotePort: 6697,
					localAddress: "203.0.113.5",
					localPort: 12345,
				}
			);

			expect(reply).to.equal("12345, 6697 : USERID : TheLounge : alice\r\n");
		});

		it("matches when both ends use identical representations", function () {
			const reply = respond(
				{remoteAddress: "198.51.100.10", localAddress: "203.0.113.5"},
				{
					remoteAddress: "198.51.100.10",
					remotePort: 6697,
					localAddress: "203.0.113.5",
					localPort: 12345,
				}
			);

			expect(reply).to.equal("12345, 6697 : USERID : TheLounge : alice\r\n");
		});

		it("does not respond for a different remote address (anti-enumeration)", function () {
			const reply = respond(
				{remoteAddress: "198.51.100.99", localAddress: "203.0.113.5"},
				{
					remoteAddress: "198.51.100.10",
					remotePort: 6697,
					localAddress: "203.0.113.5",
					localPort: 12345,
				}
			);

			expect(reply).to.equal("12345, 6697 : ERROR : NO-USER\r\n");
		});

		it("does not respond when the connection has no local address", function () {
			const reply = respond(
				{remoteAddress: "198.51.100.10", localAddress: "203.0.113.5"},
				{
					remoteAddress: "198.51.100.10",
					remotePort: 6697,
					localAddress: undefined,
					localPort: 12345,
				}
			);

			expect(reply).to.equal("12345, 6697 : ERROR : NO-USER\r\n");
		});

		it("does not equate distinct loopback families", function () {
			const reply = respond(
				{remoteAddress: "::1", localAddress: "::1"},
				{
					remoteAddress: "127.0.0.1",
					remotePort: 6697,
					localAddress: "127.0.0.1",
					localPort: 12345,
				}
			);

			expect(reply).to.equal("12345, 6697 : ERROR : NO-USER\r\n");
		});
	});
});
