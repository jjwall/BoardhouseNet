import * as cp from 'child_process';

export function spinUpGameServer(port: string) {
	// Comment out for debugging.
	var child = cp.spawn("node ./server/game-server.bundle.js " + port, { shell: true });

	// Uncomment for debugging.
	// var child = cp.spawn("node --inspect-brk ./server/game-server.bundle.js " + port, { shell: true });

	child.stdout.on('data', function(data) {
		console.log(data.toString());
	});
}