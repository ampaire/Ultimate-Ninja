/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */

import Phaser from 'phaser';
import Button from '../DOM/button';
import config from '../Helpers/config';

export default class PlayerInfo extends Phaser.Scene {
  constructor() {
    super('PlayerInfo');
    this.player;
  }

  preload() {
    this.load.html('info', 'assets/form.html');
  }

  create() {
    const htmlDom = this.add.dom(config.width / 2, config.height / 2 - 50).createFromCache('info');
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;

    this.scoresButton = new Button(this, config.width / 2, config.height / 2 + 50, 'btnStock1', 'btnStock2', 'Start Game', 'GameScene');
    this.menuButton = new Button(this, 400, 500, 'btnStock1', 'btnStock2', 'Menu', 'TitleScene');
    const getNameText = this.make.text({
      x: width / 2,
      y: height / 2 - 100,
      text: '',
      style: {
        font: '30px Amita',
        fill: '#ffff',
      },
    });
    getNameText.setOrigin(0.5, 0.5);
    getNameText.setText(` 
    Good day ninja, Enter your name your name please......
    `);
    this.player = htmlDom.getChildByName('player');
    localStorage.setItem('name', this.player.value);
  }
}