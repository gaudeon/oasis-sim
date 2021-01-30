import 'phaser';
import 'lodash';
import 'webfontloader';

import BootScene from './scenes/boot';
import LoginScene from './scenes/login';
import OasisScene from './scenes/oasis';
import RoomScene from './scenes/room';
import colors from './config/colors.json';

var gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: colors.Black.str,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true, // enable to see physics bodies outlined
        }
    },
    scene: [BootScene, LoginScene, OasisScene, RoomScene]
};

let game = new Phaser.Game(gameConfig);