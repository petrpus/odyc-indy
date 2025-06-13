import { createGame } from "odyc";
import { Howl, Howler } from "howler";

const bgMusic = new Howl({
  src: ["media/adventure.ogg", "media/adventure.mp3"],
  autoplay: true,
  loop: true,
  volume: 0.3,
});

let items = [];
let count = 0;
let frame = 0;

const pickUp = async (target) => {
  game.player.position = target.position;
  items.push(target.symbol);
  target.remove();
  await game.playSound("PICKUP", 24);
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
    game.playSound("FALL", 4);
    game.end(
      `%<4>*** GAME OVER! ***<4>%\n\n<5>${message}<5>\n\n Press SPACE or tap to restart.`
    );
  }, 1000);
};

const fireSprite = `
  ....4...
  ....4...
  ..5445..
  .564645.
  .5444665
  56656465
  .566565.
  ..5565..
  `;

const fireSprite2 = `
  ...4....
  ...4....
  ..5445..
  .546465.
  5666445.
  56465665
  .565665.
  ..5655..
  `;

function createFlippingFireTemplate(speed = 10) {
  console.log("creating flipping fire template");
  let count = 0;
  let frame = 0;

  return () => {
    if (++count >= speed) {
      count = 0;
      frame = 1 - frame;
    }
    console.log(frame);
    return {
      sprite: frame === 0 ? fireSprite : fireSprite2,
      async onCollide(target) {
        if (items.includes("e")) {
          await game.playSound("HIT", 13);
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
          await game.playSound("EXPLOSION", 18);
          await gameOver("You got burned, next time use a fire extinguisher.");
        }
      },
      onScreenEnter() {
        items = [];
        count = 0;
      },
    };
  };
}

const playAudio = () => {
  const audio = document.getElementById("bg-music");
  audio.play().catch((err) => {
    console.warn("Playback failed:", err);
  });
};

const game = createGame({
  title: `<7>The Last Mission of
  
_INDIANA JONES_<7>
  

<5>collect all flags and escape the maze<5>


use arrows (or slide) \n to move,\n\n press SPACE (or tap)\n to continue action
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
      sound: ["PICKUP", 12],
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
        if (!items.includes("k")) {
          game.playSound("FALL", 33);
          console.log("closed");
        } else if (count < 3) {
          game.playSound("FALL", 33);
          game.openMessage(
            "You have to collect all flags!\n\nPress SPACE or tap to continue"
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
            await game.playSound("PICKUP", 3);
            await game.end(
              "<7>*** YOU WON !!! ***<7>\n\nPress SPACE or tap to play again."
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
      sprite: fireSprite,
      async onCollide(target) {
        if (items.includes("e")) {
          await game.playSound("HIT", 13);
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
          await game.playSound("EXPLOSION", 18);
          await gameOver("You got burned, next time use a fire extinguisher.");
        }
      },
      onScreenEnter(target) {
        items = [];
        count = 0;
        setInterval(() => {
          frame = 1 - frame;
          target.sprite = frame === 0 ? fireSprite : fireSprite2;
        }, 300);
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
        game.playSound("BLIP", 1);
        game.openMessage(
          "Remember the password:\n\n<3>a3*F<3> \n\nPress  or tap to close."
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
        await game.openMessage(
          "<3>Say the correct password or be eaten!<3>\n\nIn the next step\nselect the answer\nwith arrows (or slide)\n\nthen hit SPACE or tap\nto confirm the choice.\n\n>>>SPACE>>>"
        );
        const choice = await game.prompt("3a*F", "a3*F", "a3@F", "a*F3");
        if (choice === 1) {
          await game.playSound("POWERUP", 1);
          target.remove();
        } else {
          gameOver("You reallyneed to know the right password!");
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
        if (items.includes("s")) {
          await game.playSound("HIT", 13);
          target.sprite = `
            ........
            ........
            ........
            ...88.8.
            68.0088.
            63840...
            68.4488.
            ...4448.
          `;
          setTimeout(async () => {
            target.remove();
          }, 1000);
        } else {
          await game.openDialog("^You shall not pass!^|>>SPACE>>");
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
  controls: {
    LEFT: ["ArrowLeft"],
    RIGHT: ["ArrowRight"],
    UP: ["ArrowUp"],
    DOWN: ["ArrowDown"],
    ACTION: ["Enter", "Space", "Escape"],
  },
});
