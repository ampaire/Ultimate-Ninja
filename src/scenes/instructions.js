import Phaser from 'phaser';
import Button from '../helpers/button';

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
        font: '30px monospace',
        fill: '#ffffff',
      },
    });
    instructionsText.setOrigin(0.5, 0.5);
    instructionsText.setText(` 
    Ultimate Ninja is a fighting game,
    The fighting scene has two enemies
    on the left and you also have two 
    players on the right to fight against
    the enemies. 
    Use the space bar to attack your enemy
    Also use the ⬆, ⬇, ⬅ or ➡ arrows on the 
    keyboard to dodge the enemy's attack and
    move to higher levels`);
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');
  }
}