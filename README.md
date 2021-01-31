# O.A.S.I.S. Sim
Three hidden keys open three secret gates...

Text based adventure simulation of the O.A.S.I.S. in homage to the simulation from the RPO universe authored by Ernest Cline in his books "Ready Player One" and "Ready Player Two". Thanks Mr. Cline for a new dream landscape and the endless enjoyment found within it!  

## Setup
- npm install

## Running webpack dev server
- npm start

## creating a packaged distribution
- npm run dist

## Dependencies

Besides a linux os with Node/Npm...

- Twine 2 for Map Editing - [Link](https://twinery.org/)

- TwineJSON story format to save Map to src/config/map.json - [Link](https://github.com/cauli/TwineJson)

## Importing map into Twine

Import file src/config/map.twine.html

## Updating map.twine.html

Change Story Format to Harlowe

Then Publish to File and choose src/config/map.twine.html to save it.

## Exporting to src/config/map.json

Change Story to TwineJSON

Click Play

Copy/Paste JSON into src/config/map.json

### Special markup to use Twine for map editing

All special markup need to have double curly braces around them. Example: {{keyname}} 

keynames become keys in the Twine Passage object stored in JSON (with TwineJSON Format) Example:

{{isStartingRoom}}1{{/isStartingRoom}} coverts to JSON { isStartingRoom: 1 }

Each Twine passage should have a name tag identifying the kind of thing it is. Current tag types supported:
- item
- room
- door
- npc

#### item

Item Passages represent template descriptions of a given item associated with rooms. 

Their title is formated as: Item-ITEMNAME

Where ITEMNAME is whatever the name of the item actually is

They are tagged as type: item

They have the following content format:

    {{key}}unique item key{{/key}}
    {{description}}the item's basic description used when looking at a room{{/description}}

Example Item:

    Title: Item-Rock

    Tag: item

    Content:
        {{key}}rock{{/key}}
        {{description}}a ${style-itemHighlight}rock${style-defaultDescription}{{/description}}

#### door

Twine Passages tagged as door represent template descriptions of exits associated with rooms.

Their title is formmated as: Door-DIRECTION-ROOMNAME

Where the DIRECTION is one of the supported cardinal directions (North, Sounth, East, West, NorthEast, NortWest, SouthEast, SouthWest, Up or Down) and ROOMNAME is the name of the room the door is found within

They are tagged as type: door

They hav ethe following content format:

    {{description}}The description displayed when a door is looked at directly by a player{{description}}
    [[Room-ROOMNAMETARGET]]

Example Door:

    Title: Door-South-IncipioPlayerHubParkCenter

    Tag: door

    Content:
        {{description}}a walkway leading to the center of the player hub{{/description}}
        [[Room-IncipioPlayerHubParkCenter]]

#### room

Twine Passages tagged as room represent template descriptions of rooms a player can be in. They contain items and doors.

Their title is formatted as: Room-ROOMNAME

Where the ROOMNAME is the unique name of the room

They are tagged as type: room

They have the following content format:

    {{isStartingRoom}}This is included as set to one (1) if this is the first room a player starts in{{/isStartingRoom}}
    {{description}}The room description when a player looks at the room{{/description}}
    [[Item-ITEMNAME]]
    {{Item-ITEMNAME-Location}}a description of where the item is located in the room{{/Item-ITEMNAME-Location}}
    [[Door-DIRECTION-ROOMNAMETARGET]]
    {{onDIRECTION}}[ { 
    	"type": "TextAction", 
    	"text": "Descriptive text that triggers as a TextActrion when player travels through a door with that this associated direction"
    } ]{{/onDIRECTION}}

Example Room:

    Title: Room-IncipioPlayerHubParkCenter

    Tag: room

    Content:
        {{isStartingRoom}}1{{/isStartingRoom}}
        {{description}}You appear at Incipio PlayerHub #1337. Your are at the center of the small sparsely detailed park.{{/description}}
        [[Item-Rock]]
        {{Item-Rock-Location}}on the ground{{/Item-Rock-Location}}
        [[Npc-Tron]]
        [[Door-North-IncipioMegaMallEntrance]]
        {{onNorth}}[ { 
        	"type": "TextAction", 
        	"data": "You walk down the path towards the megamall."
        } ]{{/onNorth}}

#### npc

Npc Passages represent template descriptions of a given non player character associated with rooms. 

Their title is formated as: Npc-NPCNAME

Where NPCNAME is whatever the name of the Npc actually is

They are tagged as type: npc 

They have the following content format:

    {{key}}unique npc key{{/key}}
    {{description}}the npc's basic description used when looking at a room{{/description}}

Example Npc:

    Title: Npc-Tron 

    Tag: npc 

    Content:
        {{key}}tron{{/key}}
        {{description}}an adult male in a blue glowing digital light suit. His name is ${style-npcHighlight}Tron${style-defaultDescription}{{/description}}
        {{idleActions}} [ {
            "frequency": "rare",
            "actions": [ { 
                "type": "TextAction",
                "data": "${style-npcHighlight}Tron ${style-defaultDescription}says ${style-npcSpeech}Hey User, if you happen upon Flynn or my old User in your adventures tell them I said hello."  
            }, {
            "frequency": "uncommon",
            "actions": [ { 
                "type": "TextAction",
                "data": "${style-npcHighlight}Tron ${style-defaultDescription} looks off in the distance at the floating ads and tall buildings, slightly shakes his head and says ${style-npcSpeech}stranger and stranger."  
            } ]
        } ]
        {{/idleActions}}
        {{onPlayerEnter}}[ {
            "type": "TextAction",
            "data": "${style-npcHighlight}Tron ${style-defaultDescription}says ${style-npcSpeech}Hello User ${data-PlayerName}. Welcome to Incipio PlayerHub #1337."
        } ]{{onPlayerEnter}}
        {{onTell}}
        { 
            "defaultResponse": [ {
                "type": "TextAction",
                "data": "${style-npcHighlight}Tron ${style-defaultDescription}says ${style-npcSpeeach}What can I do for you?"
            } ],
            "conditionalResponses": [ {
                "keyPhrases" : [ "help" ],
                "responsese" : [ { 
                    "type": "TextAction",
                    "data": "${style-npcHighlist}Tron ${style-defaultDescription}says ${style-npcSpeech}Incipio is a pretty straight forward world, there are megamalls and public areas to chat and socialize on this planet. In fact walk from here to the ${style-exitHighlight}north and we you find a mall. For anything else I recommend heading to teleporting elsewhere, if you have the credits of course.  
                } ]
            } ]
        }
        {{/onTell}}