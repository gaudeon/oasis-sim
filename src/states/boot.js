// json imports
import fontConfig from '../../assets/json/fonts.json';

// web fonts
import WebFont from 'webfontloader';

// require in other assets to be included but not added to cache at this time
// require('../../assets/sounds/sound.wav');
// require('../../assets/json/tilemap.json');
// require('../../assets/images/tileset.png');

export default class LoadingState extends Phaser.State {
    init () {
        // font loading requirements
        this.requireWebFont('arcade');
        this.requireWebFont('arcade-classic');
        this.requireWebFont('atarian-system');
        this.requireWebFont('rubik');

        this.showLoading();
    }

    preload () {
        // load json configuration files
        // this.game.cache.addJSON('jsonConfig', null, jsonConfig);

        // font loading (only call loadWebFonts once)
        this.loadWebFonts('arcade', 'arcade-classic', 'atarian-system', 'rubik');
    }

    create () {
        // p2 physics
        /* this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.8; */

        // arcade physics
        // this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    update () {
        if (this.areWebfontsLoaded()) {
            this.state.start('Room');
        }
    }

    showLoading () {
        var loadingText = 'Loading...';

        var text = this.add.text(0, 0, loadingText, {
            font: 'Helvetica, Arial, Sans-Serif',
            fill: '#ffffff',
            fontSize: 48,
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });

        text.setTextBounds(0, 0, this.world.width, this.world.height);
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
            familyList.push(key);
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
};
