/* eslint-disable no-unused-vars */
import Phaser from 'phaser';

import Model from './DOM/model';
import BootScene from './sceneManager/bootScene';
import PreloaderScene from './sceneManager/preloader';
import TitleScene from './sceneManager/gameTitle';
import OptionsScene from './sceneManager/gameOptions';
import InstructionsScene from './sceneManager/gameInstructions';
import GameScene from './sceneManager/battleScene';
import PlayerInfo from './sceneManager/getName';
import ScoresScene from './sceneManager/gameScore';

import config from './Helpers/config';

const gameConfig = Object.assign(config, {
  scene: [
    BootScene,
    PreloaderScene,
    TitleScene,
    OptionsScene,
    InstructionsScene,
    GameScene,
    PlayerInfo,
    ScoresScene,
  ],
});

class Game extends Phaser.Game {
  constructor() {
    super(gameConfig);
    const model = new Model();
    this.globals = { model, bgMusic: null };
  }
}

const game = new Game();
