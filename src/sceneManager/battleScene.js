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
      frameWidth: 48,
      frameHeight: 53,
    });
    this.load.spritesheet('enemies', './assets/enemies.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.audio('gameOver', ['assets/audio/game-over-2.wav']);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x8B0000, 1);
    this.graphics.strokeRect(10, 380, 290, 150);
    this.graphics.fillRect(10, 380, 290, 150);
    this.graphics.strokeRect(310, 380, 190, 150);
    this.graphics.fillRect(310, 380, 190, 150);
    this.graphics.strokeRect(510, 380, 280, 150);
    this.graphics.fillRect(510, 380, 280, 150);

    const warrior = new PlayerCharacter(this, config.width / 2 - 200, config.height / 2, 'disciple', 120, 100);
    this.add.existing(warrior);

    const mushroom = new Enemy(this, config.width / 2 + 200, config.height / 2, 'enemies', 0, 'Poisonous mushroom', 120);
    this.add.existing(mushroom);

    const ant = new Enemy(this, config.width / 2 + 200, config.height / 2, 'enemies', 1, 'Ant', 120);
    this.add.existing(ant);

    const duck = new Enemy(this, config.width / 2 + 200, config.height / 2, 'enemies', 3, 'Mad Duck', 120);
    this.add.existing(duck);

    const pig = new Enemy(this, config.width / 2 + 200, config.height / 2, 'enemies', 4, 'Serious Pig', 120);
    this.add.existing(pig);

    const flower = new Enemy(this, config.width / 2 + 200, config.height / 2, 'enemies', 5, 'Magic Flower', 120);
    this.add.existing(flower);

    this.heroes = [warrior];

    this.enemies = [mushroom, ant, duck, pig, flower];

    this.units = this.heroes.concat(this.enemies);

    scoreText = this.add.text(50, 16, `score: ${this.score}`, {
      fontSize: '32px',
      fill: '#000',
    });
    gameOverText = this.add.text(400, 300, 'Game Over', {
      fontSize: '64px',
      fill: '#000',
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    this.gameOverSound = this.sound.add('gameOver');

    this.scoreBoard = new Button(
      this,
      400,
      40,
      'btnStock1',
      'btnStock2',
      'Scores',
      'ScoresScene',
    );

    this.menuButton = new Button(
      this,
      700,
      40,
      'btnStock1',
      'btnStock2',
      'Menu',
      'TitleScene',
    );
  }


  async getScore() {
    const scores = new PlayerInfo();
    const scoreArr = await scores.uploadScore(localStorage.getItem('name'), this.score);
  }

  restart() {
    this.scene.start('ScoresScene');
  }
}