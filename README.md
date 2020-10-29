# boardhouse-node
This repo serves as a full-stack enviornment for the [boardhouse game framework](https://github.com/jjwall/BoardhouseTS). The primary project goal is to add networking via websockets to boardhouse. Boardhouse is originally developed as a front-end game engine solution for browser based games. Setting up a client / server architecture would involve splitting up the existing front-end solution into two parts: front and back. Front will handle rendering game objects as well as sending messages to the server. Back will handle the lobby system, game engine logic and handling and sending messages back to the client. This is why ``src`` is split up into ``front`` and ``back``.  If there were an easier way to bolt on a networking layer to boardhouse, I'd go that route, but currently this is the best solution I have come up with.

___

### Build Instructions:
```
npm install
npm run build
cd dist
node lobby.js
```

Go to ``localhost:8080`` to test it out. All production files will be contained in the ``dist`` folder.
___

### Notes:

#### Back:
* corecompoents -> component getters that need to add Ent to changeList
* Implement EntityChangeList
* processmessages -> call entity create for newly joined player (will need to get data for ents to front end)

#### Front:
* main -> implement NetToEndId list
* Implement message handler system functions

#### General stuff:
* Need to get an appropriately sized random PlayerId. Current one is too big.
* Give back src treatment same treatment front got (transfer over most recent boardhouse changes over)
* Add UI layer (fix up current UI changes by finishing or removing input box)
* Add all events (pointer, mouse, keyboard)
