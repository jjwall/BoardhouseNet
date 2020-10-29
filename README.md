# boardhouse-node
This repo serves as a full-stack enviornment for the [boardhouse game framework](https://github.com/jjwall/BoardhouseTS). The primary project goal is to add networking via websockets to boardhouse. Boardhouse is originally developed as a front-end game engine solution for browser based games. Setting up a client / server architecture would involve splitting up the existing front-end solution into two parts: client and server. Client will handle rendering game objects as well as sending messages to the server. Server will handle the lobby system, game engine logic and handling and sending messages back to the client. This is why ``src`` is split up into ``client`` and ``server``.  If there were an easier way to bolt on a networking layer to boardhouse, I'd go that route, but currently this is the best solution I have come up with.

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
* <u>lobby.js</u> (lobby server): src > server > lobby > main.ts
* <u>lobby-client.bundle.js</u>: src > client > lobby > main.ts
* <u>game-server.bundle.js</u>: src > server > engine > main.ts
* <u>game-client.bundle.js</u>: src > client > engine > main.ts
___

### Lobby / Game Server Relationship

The lobby is used to create rooms (i.e. game servers) and enable clients to connect to them as a player or a spectator. The lobby server is established by running the above command ``node lobby.js`` in the ``dist`` folder. If a client were to "create a room" then a child process of ``game-server.bundle.js`` would be spawned. The magic here happens in ``src > server > lobby > spinupgameserver.ts``

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
* Need to have a ClientRole variable on ClientEngine that indicates if the user is a spectator, player etc. Player roles would be able to send key press events to server.
Roles would be checked in the event handling system
* Should add a spectate button to the lobby list to test this idea
* Need to get an appropriately sized random PlayerId. Current one is too big.
* Give back src treatment same treatment front got (transfer over most recent boardhouse changes over)
* Add UI layer (fix up current UI changes by finishing or removing input box)
* Add all events (pointer, mouse, keyboard)
