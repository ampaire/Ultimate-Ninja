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
    To play the game<hr/> Use arrows to spacebar to slide <br/>
    towards the enemy and hit him. The enemy<br/> will also
    slide to you to hit you <br/> The game ends when one's health bar is done!<br/> Enjoy
    the adventure`);
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