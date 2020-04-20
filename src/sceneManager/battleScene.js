/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable block-scoped-var */
/* eslint-disable no-use-before-define */
import Phaser from 'phaser';


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const BattleScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function BattleScene() {
      Phaser.Scene.call(this, { key: 'BattleScene' });
    },

  create() {
    this.add.image(160, 120, 'background');
    this.startBattle();

    this.sys.events.on('wake', this.startBattle, this);
  },

  startBattle() {
    this.load.spritesheet('enemies', 'assets/enemies.png', { frameWidth: 32, frameHeight: 32 });
    const warrior = new Hero(this, 140, 130, 'player', 9, 'Hero', 100);
    this.add.existing(warrior);
    this.heroes = [warrior];

    const randomNum = getRndInteger(1, 3);

    if (randomNum === 1) {
      const mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
      const ant = new Enemy(this, 175, 70, 'enemies', 1, 'Ant', 20);
      const duck = new Enemy(this, 175, 70, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 175, 70, 'enemies', 4, 'Magik Pig', 20);
      const flower = new Enemy(this, 175, 70, 'enemies', 5, 'Flower', 20);

      const monster1 = [mushroom, ant, duck, pig, flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      this.add.existing(enemy1);
      this.enemies = [enemy1];
    } else if (randomNum == 2) {
      const mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
      const ant = new Enemy(this, 175, 70, 'enemies', 1, 'Ant', 20);
      const duck = new Enemy(this, 210, 70, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 70, 'enemies', 4, 'Magik Pig', 20);

      const monster1 = [mushroom, ant];
      const monster2 = [duck, pig];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];

      this.add.existing(enemy1);
      this.add.existing(enemy2);

      this.enemies = [enemy1, enemy2];
    } else if (randomNum == 3) {
      const mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
      const ant = new Enemy(this, 175, 70, 'enemies', 1, 'Ant', 20);
      const duck = new Enemy(this, 210, 70, 'enemies', 3, 'Mad Duck', 20);
      const pig = new Enemy(this, 210, 70, 'enemies', 4, 'Magik Pig', 20);
      const flower = new Enemy(this, 245, 70, 'enemies', 5, 'Flower', 20);

      const monster1 = [mushroom, ant];
      const monster2 = [duck, pig];
      const monster3 = [flower];

      const enemy1 = monster1[getRndInteger(0, monster1.length)];
      const enemy2 = monster2[getRndInteger(0, monster2.length)];
      const enemy3 = monster3[getRndInteger(0, monster3.length)];

      this.add.existing(enemy1);
      this.add.existing(enemy2);
      this.add.existing(enemy3);

      this.enemies = [enemy1, enemy2, enemy3];
    }

    this.units = this.heroes.concat(this.enemies);

    this.index = -1;

    this.scene.launch('UIScene');
  },
  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index++;

      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index] instanceof Hero) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      this.units[this.index].attack(this.heroes[r]);
      this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
    }
  },

  checkEndBattle() {
    let victory = true;
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) victory = false;
    }
    let gameOver = true;
    for (let i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) gameOver = false;
    }
    return victory || gameOver;
  },
  receivePlayerSelection(action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }

    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  },
  endBattle() {
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].destroy();
    }
    this.units.length = 0;
    this.heroes.hp = 100;
    this.enemies.hp = 40;

    this.scene.sleep('UIScene');
  },

});

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

    function Unit(scene, x, y, texture, frame, type, hp) {
      Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
      this.type = type;
      this.maxHp = this.hp = hp;
      this.living = true;
      this.menuItem = null;
    },
  setMenuItem(item) {
    this.menuItem = item;
  },
  attack(target) {
    if (target.living) {
      const damage = getRndInteger(0, 10);
      target.takeDamage(damage);
      this.scene.events.emit('Message', `${this.type} attacks ${target.type} for ${damage} damage`);
    }
  },
  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  },
});

let Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Enemy(scene, x, y, texture, frame, type, hp) {
      Unit.call(this, scene, x, y, texture, frame, type, hp);
    },
});

let Hero = new Phaser.Class({
  Extends: Unit,

  initialize:
    function Hero(scene, x, y, texture, frame, type, hp) {
      Unit.call(this, scene, x, y, texture, frame, type, hp);

      this.setScale(5);
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

  unitKilled() {
    this.active = false;
    this.visible = false;
  },

});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize:

    function Menu(x, y, scene) {
      Phaser.GameObjects.Container.call(this, scene, x, y);
      this.menuItems = [];
      this.menuItemIndex = 0;
      this.x = x;
      this.y = y;
      this.selected = false;
    },
  addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },

  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },

  select(index) {
    if (!index) index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
      if (this.menuItemIndex == index) return;
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },

  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
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
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
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
    this.scene.events.emit('SelectedAction');
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

const UIScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

    function UIScene() {
      Phaser.Scene.call(this, { key: 'UIScene' });
    },

  create() {
    this.BattleScene = this.scene.get('BattleScene');

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(-2, 0x000000);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 150, 90, 100);
    this.graphics.fillRect(2, 150, 90, 100);
    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

    this.menus = this.add.container();

    this.heroesMenu = new HeroesMenu(9, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(195, 153, this);

    this.currentMenu = this.actionsMenu;

    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.GameScene = this.scene.get('BattleScene');

    this.input.keyboard.on('keydown', this.onKeyInput, this);

    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    this.events.on('SelectedAction', this.onSelectedAction, this);

    this.events.on('Enemy', this.onEnemy, this);
    this.sys.events.on('wake', this.createMenu, this);
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  },
  createMenu() {
    this.remapHeroes();
    this.remapEnemies();
    this.battleScene.nextTurn();
  },
  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },
  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },
  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  },
  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  },
  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  },
  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowLeft' || event.code === 'Shift') {
      } else if (event.code === 'Enter' || event.code === 'ArrowRight') {
        this.currentMenu.confirm();
      }
    }
  },
});

let Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
    function Message(scene, events) {
      Phaser.GameObjects.Container.call(this, scene, 160, 30);
      const graphics = this.scene.add.graphics();
      this.add(graphics);
      graphics.lineStyle(1, 0xffffff, 0.8);
      graphics.fillStyle(0x031f4c, 0.3);
      graphics.strokeRect(-90, -15, 180, 30);
      graphics.fillRect(-90, -15, 180, 30);
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
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});

export { BattleScene, UIScene };