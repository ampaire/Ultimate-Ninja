import Phaser from 'phaser';
import Button from '../helpers/button';

export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('InstructionsScene');
  }

  create() {
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    this.add.image(50, 500, 'arrow');
    this.add.image(50, 550, 'space');
    this.add.text(
      100,
      480,
      'Move and select',
      { fontSize: '26px', fill: '#B09B1C' },
    );
    this.add.text(
      300,
      100,
      'confirm and attack ',
      { fontSize: '26px', fill: '#B09B1C' },
    );
    this.add.text(
      300,
      180,
      'Enemies are not visible ',
      { fontSize: '20px', fill: '#B09B1C' },
    );
    this.add.text(
      300,
      260,
      'Use brute force to see them',
      { fontSize: '20px', fill: '#B09B1C' },
    );
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
    Another set of enemies is added,
    Fight them all to become the Ultimate ninja.
    `);
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');
  }
}