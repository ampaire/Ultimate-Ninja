/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-vars */

import Phaser from 'phaser';
import PlayerInfo from './getName';
import config from '../Helpers/config';
import Button from '../DOM/button';


let player;
let scoreText;
let gameOverText;

const Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
    function Message(scene, events) {
      Phaser.GameObjects.Container.call(this, scene, 160, 30);
      const graphics = this.scene.add.graphics();
      this.add(graphics);
      graphics.lineStyle(1, 0xffffff, 0.8);
      graphics.fillStyle(0x031f4c, 0.3);
      graphics.strokeRect(-90, -200, 180, 30);
      graphics.fillRect(-90, -200, 180, 30);
      this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
        color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true },
      });
      this.add(this.text);
      this.text.setOrigin(0.5);
      events.on('Message', this.showMessage, this);
      this.visible = false;
    },
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) { this.hideEvent.remove(false); }
    this.hideEvent = this.scene.time.addEvent({
      delay: 2000, callback: this.hideMessage, callbackScope: this,
    });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.damage = damage;
    },
  attack(target) {
    target.takeDamage(this.damage);
  },
  takeDamage(damage) {
    this.hp -= damage;
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    },
});

const PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
      Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

      this.setScale(2);
    },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

    function MenuItem(x, y, text, scene) {
      Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    },

  select() {
    this.setColor('#f8ff38');
  },

  deselect() {
    this.setColor('#ffffff');
  },
});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene, heroes) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.heroes = heroes;
      this.x = x;
      this.y = y;
    },
  addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;
    if (this.menuItemIndex < 0) { this.menuItemIndex = this.menuItems.length - 1; }
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if (this.menuItemIndex >= this.menuItems.length) { this.menuItemIndex = 0; }
    this.menuItems[this.menuItemIndex].select();
  },
  // select the menu as a whole and an element with index from it
  select(index) {
    if (!index) { index = 0; }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },
  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },
  confirm() {
    // wen the player confirms his slection, do the action
  },
  clear() {
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      this.addMenuItem(unit.type);
    }
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function HeroesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function ActionsMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
      this.addMenuItem('Attack');
    },
  confirm() {
    this.scene.events.emit('SelectEnemies');
  },

});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

    function EnemiesMenu(x, y, scene) {
      Menu.call(this, x, y, scene);
    },
  confirm() {
    this.scene.events.emit('Enemy', this.menuItemIndex);
  },
});

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('disciple', 'assets/disciple.png', {
      frameWidth: 47,
      frameHeight: 53,
    });
    this.load.spritesheet('enemies', './assets/enemies.png', {
      frameWidth: 80,
      frameHeight: 80,
    });
    this.load.audio('gameOver', ['assets/audio/game-over-2.wav']);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x8B0000, 1);
    this.graphics.strokeRect(10, 420, 290, 150);
    this.graphics.fillRect(10, 420, 290, 150);
    this.graphics.strokeRect(310, 420, 190, 150);
    this.graphics.fillRect(310, 420, 190, 150);
    this.graphics.strokeRect(510, 420, 280, 150);
    this.graphics.fillRect(510, 420, 280, 150);


    const warrior = new PlayerCharacter(this, config.width / 2 + 200, config.height / 2, 'disciple', 1, 'player', 20);
    warrior.flipX = true;
    this.add.existing(warrior);
    this.heroes = [warrior];

    const randomNum = getRndInteger(1, 3);

    if (randomNum == 1) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 4, 'Serious Pig', 20);
      const flower = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 5, 'Magic Flower', 20);

      const monster1 = [mushroom, Ant, duck, pig, flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      enemy1.flipX = true;
      this.add.existing(enemy1);
      this.enemies = [enemy1];

      this.units = this.heroes.concat(this.enemies);
    } else if (randomNum == 2) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, 210, 180, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 180, 'enemies', 4, 'Serious Pig', 20);

      const monster1 = [mushroom, Ant];
      const monster2 = [duck, pig];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];
      enemy1.flipX = true;
      enemy2.flipX = true;

      this.add.existing(enemy1);
      this.add.existing(enemy2);

      this.enemies = [enemy1, enemy2];

      this.units = this.heroes.concat(this.enemies);
    } else if (randomNum == 3) {
      const mushroom = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 0, 'Poisonous Shroom', 20);
      const Ant = new Enemy(this, config.width / 2 - 200, config.height / 2, 'enemies', 1, 'Crazy Ant', 20);
      const duck = new Enemy(this, 210, 200, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 200, 'enemies', 4, 'Serious Pig', 20);
      const flower = new Enemy(this, 245, 190, 'enemies', 5, 'Magic Flower', 20);

      const monster1 = [mushroom, Ant];
      const monster2 = [duck, pig];
      const monster3 = [flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];
      const enemy3 = monster3[getRndInteger(0, monster3.length)];

      enemy1.flipX = true;
      enemy2.flipX = true;
      enemy3.flipX = true;

      this.add.existing(enemy1);
      this.add.existing(enemy2);
      this.add.existing(enemy3);

      this.enemies = [enemy1, enemy2, enemy3];

      this.units = this.heroes.concat(this.enemies);
    }

    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(540, 460, this);
    this.actionsMenu = new ActionsMenu(340, 460, this);
    this.enemiesMenu = new EnemiesMenu(40, 460, this);
    this.battleScene = this.scene.get('GameScene');

    this.currentMenu = this.actionsMenu;
    this.heroesMenu.remap(this.heroes);
    this.enemiesMenu.remap(this.enemies);

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);
    this.remapHeroes();
    this.remapEnemies();


    this.input.keyboard.on('keydown', this.update, this);
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
    this.events.on('SelectEnemies', this.onSelectEnemies, this);
    this.events.on('Enemy', this.onEnemy, this);
    this.battleScene.nextTurn();
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);


    gameOverText = this.add.text(400, 300, 'Game Over', {
      fontSize: '64px',
      fill: '#000',
    });

    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);
    scoreText = new Button(this, 150, 40, 'btnStock1', 'btnStock2', `score: ${this.score}`).setScale(0.8);
    this.scoreBoard = new Button(this, 400, 40, 'btnStock1', 'btnStock2', 'Scores', 'ScoresScene').setScale(0.8);
    this.scoreBoard = new Button(this, 650, 40, 'btnStock1', 'btnStock2', 'Menu', 'TitleScene').setScale(0.8);
  }

  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  }

  update(event) {
    if (this.currentMenu) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {

      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }

  nextTurn() {
    this.index++;

    if (this.index >= this.units.length) {
      this.index = 0;
    }
    if (this.units[this.index]) {
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit('PlayerSelect', this.index);
      } else {
        const r = Math.floor(Math.random() * this.heroes.length);
        this.units[this.index].attack(this.heroes[r]);
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }


  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectEnemies() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }

  receivePlayerSelection(action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  async getScore() {
    const scores = new PlayerInfo();
    const scoreArr = await scores.uploadScore(localStorage.getItem('name'), this.score);
  }


  restart() {
    this.scene.start('ScoresScene');
  }
}