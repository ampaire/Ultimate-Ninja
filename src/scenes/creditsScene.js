/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

import config from '../config/config';
import Button from '../helpers/button';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');
    this.creditsText = this.add.text(0, 0, 'Credits', {
      fontSize: '32px',
      fill: '#FFDF00',
    });
    this.madeByText = this.add.text(
      0,
      0,
      'Ultimate Ninja was created by',
      { fontSize: '26px', fill: '#FFDF00' },
    );

    this.explain = this.add.text(
      0,
      0,
      'Phemia Ampaire',
      { fontSize: '27px', fill: '#FFDF00' },
    );

    this.explain1 = this.add.text(
      0,
      0,
      'This is part of the microverse curriculum.',
      { fontSize: '24px', fill: '#fff' },
    );
    this.explain2 = this.add.text(
      0,
      0,
      ' It is a capstone project testing mastery',
      { fontSize: '24px', fill: '#fff' },
    );
    this.explain3 = this.add.text(
      0,
      0,
      'in the Javascript curriculum.',
      { fontSize: '24px', fill: '#fff' },
    );
    this.inspiration = this.add.text(0, 0, 'Special Credit: Microverse curriculum team', {
      fontSize: '20px',
      fill: '#fff',
    });
    this.assets = this.add.text(0, 0, 'Sound and Music: OpenGameArt', {
      fontSize: '18px',
      fill: '#fff',
    });
    this.social1 = this.add.text(0, 0, 'Follow me on Github: @ampaire,', {
      fontSize: '18px',
      fill: '#FFDF00',
    });
    this.social2 = this.add.text(0, 0, 'Twitter: AmpaPhem, LinkedIn: Phemia Ampaire', {
      fontSize: '18px',
      fill: '#FFDF00',
    });
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );

    [
      this.creditsText,
      this.madeByText,
      this.inspiration,
      this.assets,
      this.explain,
      this.explain1,
      this.explain2,
      this.explain3,
      this.social1,
      this.social2,
    ].forEach((el) => {
      Phaser.Display.Align.In.Center(el, this.zone);
    });

    this.madeByText.setY(5);
    this.explain.setY(50);
    this.explain1.setY(100);
    this.explain2.setY(140);
    this.explain3.setY(180);
    this.creditsText.setY(250);
    this.inspiration.setY(290);
    this.assets.setY(320);
    this.social1.setY(350);
    this.social2.setY(380);
  }
}
