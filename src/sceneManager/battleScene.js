/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-vars */

import Phaser from 'phaser';
import PlayerInfo from './getName';
import config from '../Helpers/config';
import Button from '../DOM/button';


let player;
let scoreText;
let gameOverText;

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage;
    },
  attack(target) {
    target.takeDamage(this.damage);
  },
  takeDamage(damage) {
    this.hp -= damage;
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    },
});

const PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

      this.setScale(2);
    },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    },

  select() {
    this.setColor('#f8ff38');
  },

  deselect() {
    this.setColor('#ffffff');
  },

});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.heroes = heroes;
      this.x = x;
      this.y = y;
    },
  addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;
    if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if (this.menuItemIndex >= this.menuItems.length) { this.menuItemIndex = 0; }
    this.menuItems[this.menuItemIndex].select();
  },
  select(index) {
    if (!index) { index = 0; }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },
  confirm() {
    // wen the player confirms his slection, do the action
  },
  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      this.addMenuItem(unit.type);
    }
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },

  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('Attack');
    },
  confirm() {
    // do something when the player selects an action
  },

});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm() {
    // do something when the player selects an enemy
  },

  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  },
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('disciple', 'assets/disciple.png', {
      frameWidth: 47,
      frameHeight: 53,
    });
    this.load.spritesheet('enemies', './assets/enemies.png', {
      frameWidth: 80,
      frameHeight: 80,
    });
    this.load.audio('gameOver', ['assets/audio/game-over-2.wav']);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x8B0000, 1);
    this.graphics.strokeRect(10, 420, 290, 150);
    this.graphics.fillRect(10, 420, 290, 150);
    this.graphics.strokeRect(310, 420, 190, 150);
    this.graphics.fillRect(310, 420, 190, 150);
    this.graphics.strokeRect(510, 420, 280, 150);
    this.graphics.fillRect(510, 420, 280, 150);


    const warrior = new PlayerCharacter(this, config.width / 2 + 200, config.height / 2, 'disciple', 1, 'player', 20);
    warrior.flipX = true;
    this.add.existing(warrior);
    this.heroes = [warrior];

    const randomNum = getRndInteger(1, 3);

    if (randomNum == 1) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 4, 'Serious Pig', 20);
      const flower = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 5, 'Magic Flower', 20);

      const monster1 = [mushroom, Ant, duck, pig, flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      enemy1.flipX = true;
      this.add.existing(enemy1);
      this.enemies = [enemy1];

      this.units = this.heroes.concat(this.enemies);
    } else if (randomNum == 2) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, 210, 180, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 180, 'enemies', 4, 'Serious Pig', 20);

      const monster1 = [mushroom, Ant];
      const monster2 = [duck, pig];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];
      enemy1.flipX = true;
      enemy2.flipX = true;

      this.add.existing(enemy1);
      this.add.existing(enemy2);

      this.enemies = [enemy1, enemy2];

      this.units = this.heroes.concat(this.enemies);
    } else if (randomNum == 3) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, 210, 200, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 200, 'enemies', 4, 'Serious Pig', 20);
      const flower = new Enemy(this, 245, 190, 'enemies', 5, 'Magic Flower', 20);

      const monster1 = [mushroom, Ant];
      const monster2 = [duck, pig];
      const monster3 = [flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];
      const enemy3 = monster3[getRndInteger(0, monster3.length)];

      enemy1.flipX = true;
      enemy2.flipX = true;
      enemy3.flipX = true;

      this.add.existing(enemy1);
      this.add.existing(enemy2);
      this.add.existing(enemy3);

      this.enemies = [enemy1, enemy2, enemy3];

      this.units = this.heroes.concat(this.enemies);
    }

    this.index = -1;

    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(520, 440, this);
    this.actionsMenu = new ActionsMenu(320, 440, this);
    this.enemiesMenu = new EnemiesMenu(20, 440, this);

    this.currentMenu = this.actionsMenu;
    this.heroesMenu.remap(this.heroes);
    this.enemiesMenu.remap(this.enemies);

    // this.remapHeroes();
    // this.remapEnemies();

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);


    this.battleScene = this.scene.get('GameScene');
    gameOverText = this.add.text(400, 300, 'Game Over', {
      fontSize: '64px',
      fill: '#000',
    });

    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    this.gameOverSound = this.sound.add('gameOver');

    scoreText = new Button(this, 150, 40, 'btnStock1', 'btnStock2', `score: ${this.score}`).setScale(0.8);
    this.scoreBoard = new Button(this, 400, 40, 'btnStock1', 'btnStock2', 'Scores', 'ScoresScene').setScale(0.8);
    this.scoreBoard = new Button(this, 650, 40, 'btnStock1', 'btnStock2', 'Menu', 'TitleScene').setScale(0.8);
  }


  async getScore() {
    const scores = new PlayerInfo();
    const scoreArr = await scores.uploadScore(localStorage.getItem('name'), this.score);
  }

  restart() {
    this.scene.start('ScoresScene');
  }
}