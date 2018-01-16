// import states
import BootState from './states/boot';
import LoginState from './states/login';
import RoomState from './states/room';

// import of non-js / non-json files
require('./index.html');
require('./imports/fonts');

let game = new Phaser.Game(800, 600);

Phaser.Device.whenReady(function () {
    // plugins
    game.__plugins = game.__plugins || {};

    // add plugins here
    // ...

    // setup global namespace under game for our global data
    game.global = {};

    // states
    game.state.add('Boot', BootState);
    game.state.add('Login', LoginState);
    game.state.add('Room', RoomState);

    game.state.start('Boot');
});
