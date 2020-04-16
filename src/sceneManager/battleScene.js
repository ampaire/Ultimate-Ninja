import Phaser from 'phaser';
import Button from '../DOM/button';
import Playerinfo from './getName';
import Characters from '../DOM/gameCharacters';

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
  }

  init() {
    this.hasKey = false;
  }

  preload() {
    this.load.audio('enemySound', ['assets/audio/stomp.wav']);
    this.load.audio('fightEnemy', ['assets/audio/Trap_02.mp3']);
    this.load.audio('winSound', ['assets/audio/Jingle_Win.mp3']);
    this.load.audio('gameBkgrnd', ['assets/audio/battleThemeA.mp3']);
    this.load.audio('gameOver', ['assets/audio/game-over.wav']);
  }

  create() {

  }

  update() {

  }

  restart() {

  }
}