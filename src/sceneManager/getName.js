/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */

import Phaser from 'phaser';

export default class PlayerInfo extends Phaser.Scene {
  constructor() {
    super('PlayerInfo');
    this.player;
  }

  preload() {
    this.load.html('info', 'assets/form.html');
  }

  create() {
    const htmlDom = this.add.dom(400, 200).createFromCache('info');
    htmlDom.addListener('click');
    htmlDom.on('click', e => {
      if (e.target.name === 'submit') {
        this.player = htmlDom.getChildByName('player');
        localStorage.setItem('name', this.player.value);
        if (this.player.value !== '') {
          htmlDom.removeListener('click');
          htmlDom.setVisible(false);
          this.scene.start('GameScene', {
            player: this.player.value,
          });
        } else {
          alert('Please enter your name');
          throw new Error("Error: Missing character's name");
        }
        return this.player.value;
      }
    });
  }
}