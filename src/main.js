import { createGame } from 'odyc';

let items = [];
let count = 0;
const pickUp = async (target) => {
  game.player.position = target.position;
  items.push(target.symbol);
  target.remove();
  await game.playSound('PICKUP', 24);
};

const gameOver = async (message) => {
  game.player.sprite = `
			........
			........
			..000...
			.0.0.0..
			..000...
			.0.0..0.
			.00000..
			...0....
			`;
  setTimeout(async () => {
    game.playSound('FALL', 4);
    game.end(
      `%<4>*** GAME OVER! ***<4>%\n\n<5>${message}<5>\n\n Press SPACE to restart.`
    );
  }, 1000);
};

const game = createGame({
  title: `<7>The Last Mission of
  
INDIANA JONES<7>
  

<5>collect all flags and escape the maze<5>


use arrows to move, press SPACE to continue action
  `,
  player: {
    sprite: `
			........
			..999...
			.99999..
			..383..
			..888.8.
			.777777.
			.8.77...
			...77...
			`,
    position: [1, 1],
  },
  templates: {
    x: {
      solid: false,
      sound: ['PICKUP', 12],
      sprite: `
        ........
        .933333.
        .93333..
        .9333...
        .93333..
        .933333.
        .9......
        .9......
      `,
      async onEnter(target) {
        target.remove();
        count += 1;
      },
    },
    w: {
      sprite: `
        00000000
        44404440
        00000000
        40444044
        00000000
        44404440
        00000000
        40444044
        
      `,
    },
    d: {
      sprite: `
        ........
        ...00...
        ..0660..
        .066660.
        .066660.
        .066600.
        .066660.
        .066660.
      `,
      async onCollide(target) {
        if (!items.includes('k')) {
          game.playSound('HIT', 33);
          console.log('closed');
        } else if (count < 3) {
          game.playSound('HIT', 33);
          game.openMessage(
            'You have to collect all flags!\n\nPress SPACE to continue'
          );
          return;
        } else {
          target.sprite = `
            ........
            ...00...
            ..0330..
            .033330.
            .033330.
            .033330.
            .033330.
            .033330.
          `;
          setTimeout(async () => {
            await game.playSound('PICKUP', 3);
            await game.end(
              '<7>*** YOU WON !!! ***<7>\n\nPress SPACE to play again.'
            );
          }, 500);
        }
      },
    },
    k: {
      sprite: `
      ........
      ........
      ....555.
      55555.5.
      5.5.555.
      ........
      ........
      ........  
      `,
      onCollide(target) {
        pickUp(target);
      },
    },
    e: {
      sprite: `
      ........
      ...00...
      ..0.....
      ..200...
      .444.0..
      .444.0..
      .444.0..
      .444.0..
      `,
      onCollide(target) {
        pickUp(target);
      },
    },
    f: {
      sprite: `
      ....4...
      ....4...
      ..5445..
      .564645.
      .5444665
      56656465
      .566565.
      ..5565..
      `,
      async onCollide(target) {
        if (items.includes('e')) {
          await game.playSound('HIT', 13);
          target.sprite = `
            ....4...
            ...34...
            ..3245..
            .323245.
            33333365
            .3232465
            ..33625.
            ....35..
          `;
          setTimeout(async () => {
            target.remove();
          }, 1000);
        } else {
          await game.playSound('EXPLOSION', 18);
          await gameOver('You got burned, next time use a fire extinguisher.');
        }
      },
      onScreenEnter() {
        items = [];
        count = 0;
      },
    },
    p: {
      sprite: `
        ........
        ..55555.
        .55555..
        .50005..
        .55555..
        .50055..
        55555...
        ........
      `,
      async onCollide() {
        game.playSound('BLIP', 1);
        game.openMessage(
          'Remember the password:\n\n<3>a3*F<3> \n\nPress SPACE to close.'
        );
      },
    },
    g: {
      sprite: `
        22222222
        22111122
        22101022
        21112112
        21111112
        22111122
        22122122
        21122112
      `,
      async onCollide(target) {
        const choice = await game.prompt('3a*F', 'a3*F', 'a3@F', 'a*F3');
        if (choice === 1) {
          await game.playSound('POWERUP', 1);
          target.remove();
        } else {
          gameOver('You need to know the right password!');
        }
      },
    },
    c: {
      sprite: `
        ........
        ..666...
        ..838..2
        ...8...2
        .80008.9
        .8000889
        ..8.8..9
        .88.88.9
      `,
      async onCollide(target) {
        if (items.includes('s')) {
          await game.playSound('HIT', 13);
          target.sprite = `
            ........
            ........
            ........
            ....88.8
            .68.0088
            .63840..
            .68.4488
            ....4448
          `;
          setTimeout(async () => {
            target.remove();
          }, 1000);
        } else {
          await game.openDialog('^You shall not pass!^');
        }
      },
    },
    s: {
      sprite: `
        ........
        .....22.
        ....222.
        .7.222..
        ..722...
        ..77...
        .7..7...
        ........
      `,
      onCollide(target) {
        pickUp(target);
      },
    },
  },
  map: `
    wwwwwwww
    w.wxcwdw
    w.pw...w
    w.ww.wsw
    w.f.x.ww
    w.wwwgww
    wewx..kw
    wwwwwwww
	`,
});
