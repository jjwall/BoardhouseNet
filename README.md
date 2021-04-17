# BoardhouseNet
This repo serves as a full-stack enviornment for the [boardhouse game framework](https://github.com/jjwall/BoardhouseTS). The primary project goal is to add networking via websockets to boardhouse. Boardhouse is originally developed as a front-end game engine solution for browser based games. Setting up a client / server architecture would involve splitting up the existing front-end solution into two parts: client and server. Client will handle rendering game objects as well as sending messages to the server. Server will handle the lobby system, game engine logic and handling and sending messages back to the client. Hence why ``src`` is split up into ``gameclient``, ``gameserver`` ``lobbyclient``, and ``lobbyserver``.  If there were an easier way to bolt on a networking layer to boardhouse, I'd go that route, but currently this is the best solution I have come up with.

___

### Build Instructions:
```
npm install
npm run build
cd dist
node lobby.js
```

Go to ``localhost:8080`` to test it out. All production files will be contained in the ``dist`` folder.

> More build scripts can be found in the package.json. 

The project uses 4 different bundles: lobby server bundle, lobby client bundle, game server bundle, and game client bundle. The entry points for each bundle are as follows:
* <u>lobby.js</u> (lobby server): src > lobbyserver > server.ts
* <u>lobby-client.bundle.js</u>: src > lobbyclient > main.ts
* <u>game-server.bundle.js</u>: src > gameserver > engine > main.ts
* <u>game-client.bundle.js</u>: src > gameclient > client > main.ts
___

### Lobby / Game Server Relationship

The lobby is used to create rooms (i.e. game servers) and enable clients to connect to them as a player or a spectator. The lobby server is established by running the above command ``node lobby.js`` in the ``dist`` folder. If a client were to "create a room" then a child process of ``game-server.bundle.js`` would be spawned. The magic here happens in ``src > server > lobby > spinupgameserver.ts``

___

### Debugging Child Node Process (using VS Code)
If you happen to be testing locally where you need both the lobby and game server instances running (and not running a game server instance by itself) you will need to set up a launch.json file for VS Code as follows:

```json
{
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Attach to Child Node Process",
            "address": "localhost",
            "port": 9229,
        }
    ]
}
```
And in the ```spinupgameserver.ts``` file mentioned above you would need to make this adjustment when spawning the child process:

```js
var child = cp.spawn("node --inspect-brk ./server/game-server.bundle.js " + port, { shell: true });
```

Finally, when this child process is spawned, the process will rest at an internal breakpoint which will allow you to manually attach the debugger using your newly created launch.json in VS Code. Once attached you can continue debugging from the internal breakpoint to the first breakpoint that has been set in the child process' code.
___

### Random Notes (for me):

#### Back:
* corecompoents -> component getters that need to add Ent to changeList
* Implement EntityChangeList
* processmessages -> call entity create for newly joined player (will need to get data for ents to front end)

#### Front:
* main -> implement NetToEndId list
* Implement message handler system functions

#### General stuff:
* (done) Need to have a ClientRole variable on ClientEngine that indicates if the user is a spectator, player etc. Player roles would be able to send key press events to server.
Roles would be checked in the event handling system
* (done) Should add a spectate button to the lobby list to test this idea
* (done - sort of) Need to get an appropriately sized random PlayerId. Current one is too big.
* Give back src treatment same treatment front got (transfer over most recent boardhouse changes over)
* Add UI layer (fix up current UI changes by finishing or removing input box)
* Add all events (pointer, mouse, keyboard)
* Consolidate all To-do's into one massive to-do
