import Player from '../../../src/objects/player';

describe('Player', () => {
    let player;

    describe('constructor(game)', () => {
        it('generates an object', () => {
            player = new Player(global.game);

            assert.isObject(player);
        });
    });
});
