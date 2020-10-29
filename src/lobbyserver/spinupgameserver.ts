import * as cp from 'child_process';

export function spinUpGameServer(port: string) {
	var child = cp.spawn("node ./server/game-server.bundle.js " + port, { shell: true });
	child.stdout.on('data', function(data) {
		console.log(data.toString());
	});
}