import Phaser from 'phaser';
import config from '../Helpers/config';
import Button from '../DOM/button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.add.text(180, 60, 'THE ULTIMATE NINJA', {
      fontSize: '50px', textAlign: 'center', fontFamily: 'Amita', fill: '#fff',
    });
    this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100, 'btnStock1', 'btnStock2', 'Start', 'PlayerInfo');

    this.optionsButton = new Button(this, config.width / 2, config.height / 2, 'btnStock1', 'btnStock2', 'Options', 'OptionsScene');

    this.scoresButton = new Button(this, config.width / 2, config.height / 2 + 100, 'btnStock1', 'btnStock2', 'Scores', 'ScoresScene');

    this.instructionsButton = new Button(this, config.width / 2, config.height / 2 + 200, 'btnStock1', 'btnStock2', 'Help', 'InstructionsScene');

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.loadingMusicPlaying === false) {
      this.loadingMusic = this.sound.add('loadingMusic', { volume: 0.6, loop: true });
      this.loadingMusic.play();
      this.model.loadingMusicPlaying = true;
      this.sys.game.globals.loadingMusic = this.loadingMusic;
    }
  }
}