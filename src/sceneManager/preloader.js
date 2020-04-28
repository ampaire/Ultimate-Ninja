/* eslint-disable no-undef */
import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.add.image(460, 200, 'logo');

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100, 10)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(5000, this.ready, [], this);

    this.load.image('btnStock1', 'assets/buttonStock1.png');
    this.load.image('btnStock2', 'assets/buttonStock2.png');
    this.load.image('phaserLogo', 'assets/logo.png');
    this.load.image('box', 'assets/grey_box.png');
    this.load.image('checkedBox', 'assets/blue_boxCheckmark.png');
    this.load.audio('bgMusic', ['assets/audio/battleThemeA.mp3']);

    this.load.spritesheet('hero1', 'assets/disciple.png', {
      frameWidth: 48,
      frameHeight: 53,
    });

    this.load.spritesheet('hero2', 'assets/disciple.png', {
      frameWidth: 48,
      frameHeight: 53,
    });
    this.load.image('wizarus', 'assets/map/wizard1.png');
    this.load.image('wizarus2', 'assets/map/wizard2.png');
    this.load.image('wizarus3', 'assets/map/wizard3.png');
    this.load.image('ghostus', 'assets/map/kiranga.png');
    this.load.image('master', 'assets/mater.png');
  }

  ready() {
    this.scene.start('TitleScene');
    this.readyCount += 1;
    if (this.readyCount === 2) {
      this.scene.start('TitleScene');
    }
  }
}