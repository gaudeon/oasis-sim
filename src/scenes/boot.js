// json imports
import fontConfig from '../config/fonts.json';

// web fonts
import WebFont from 'webfontloader';
require('../../assets/css/fonts.css');
require('../../assets/fonts/arcade/ARCADE.TTF');
require('../../assets/fonts/arcade-classic/ARCADECLASSIC.TTF');
require('../../assets/fonts/atarian-system/SF Atarian System.ttf');
require('../../assets/fonts/rubik/Rubik-Regular.ttf');

export default class BootScene extends Phaser.Scene {
    constructor (config, key = 'Boot') {
        super({ key: key });
    }

    init () {
        // font loading requirements
        this.requireWebFont('arcade');
        this.requireWebFont('arcade-classic');
        this.requireWebFont('atarian-system');
        this.requireWebFont('rubik');

        this.showLoading();
    }

    preload () {
        // font loading (only call loadWebFonts once)
        this.loadWebFonts('arcade', 'arcade-classic', 'atarian-system', 'rubik');
    }

    update () {
        if (this.areWebfontsLoaded()) {
            this.input.stopPropagation();
            this.scene.start('Login');
        }
    }

    showLoading () {
        var loadingText = 'INITIATING LOGIN SEQUENCE';

        var text = this.add.text(0, 0, loadingText, {
            fontFamily: 'Helvetica, Arial, Sans-Serif',
            fill: '#ffffff',
            fontSize: '32px',
        });

        text.setPadding({ top: this.sys.game.config.height / 2 - text.height / 2, right: 0, bottom: 0, left: this.sys.game.config.width / 2 - text.width / 2 });
    }

    requireWebFont (fontKey) {
        this.webfonts = this.webfonts || {};

        this.webfonts[fontKey] = false;
    }

    setWebFontLoaded (fontKey) {
        this.webfonts = this.webfonts || {};

        this.webfonts[fontKey] = true;
    } 

    loadWebFonts (...fontKeys) {
        let familyList = [];

        _.each(fontKeys, (key) => {
            familyList.push(fontConfig.fonts[key].familyName);
        });

        WebFont.load({
            active: () => {
                _.each(fontKeys, (key) => {
                    this.setWebFontLoaded(key);
                });
            },
            custom: {
                families: familyList,
                urls: [fontConfig.css.webpack]
            }
        });
    }

    areWebfontsLoaded () {
        this.webfonts = this.webfonts || {};

        for (let fontKey in this.webfonts) {
            if (!this.webfonts[fontKey]) {
                return false;
            }
        }

        return true;
    } 
}

