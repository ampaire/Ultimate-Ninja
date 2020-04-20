import Phaser from 'phaser';
import Button from '../DOM/button';

export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('InstructionsScene');
  }

  create() {
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const instructionsText = this.make.text({
      x: width / 2,
      y: height / 2 - 100,
      text: '',
      style: {
        font: '30px Amita',
        fill: '#ffff',
      },
    });
    instructionsText.setOrigin(0.5, 0.5);
    instructionsText.setText(` 
    To play the game,
    Attack the enemy,
    Then the enemy attacks you back,
    To dodge the enemies' attack,
    Use the left and right Keys.
    If you pass one level,
    More enemies are added to the field,
    Fight them all to become the Ultimate ninja.
    `);
    this.menuButton = new Button(
      this,
      400,
      500,
      'btnStock1',
      'btnStock2',
      'Menu',
      'TitleScene',
    );
  }
}