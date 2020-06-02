/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('monster', 'assets/monster.png');
    this.load.audio('bgMusic', ['assets/sounds/battleTheme.mp3']);
  }

  create() {
    this.scene.start('Preloader');
  }
}
