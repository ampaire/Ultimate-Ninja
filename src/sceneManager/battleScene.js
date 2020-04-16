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

  preload(){

  }

  cretae(){

  }

  update(){

  }

  restart(){
    
  }
}