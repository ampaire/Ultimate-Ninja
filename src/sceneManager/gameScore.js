/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import Button from '../DOM/button';
import PlayerInfo from './getName';

const sorter = (object) => {
  const scoreArr = [];
  for (let i = 0; i < object.length; i += 1) {
    scoreArr.push([object[i].user, object[i].score]);
  }
  return Array.from(scoreArr).sort((a, b) => b[1] - a[1]);
};

export default class ScoreBoard extends Phaser.Scene {
  constructor() {
    super('ScoresScene');
  }

  preload() {
    this.load.html('table', 'assets/table.html');
  }

  create() {
    this.add.text(290, 10, 'Leaderboard', { fontSize: '32px', fill: '#3D85C6' });
    this.scoreBoard = new Button(this, 400, 500, 'btnStock1', 'btnStock2', 'Menu', 'TitleScene');
    this.ranking();
  }

  async ranking() {
    const htmlDom = this.add.dom(400, 90).createFromCache('table');
    const content = htmlDom.getChildByID('body');
    content.innerHTML = '';
    const scores = new PlayerInfo();
    const scoreBoard = await scores.getLeaderboard();
    const scoreArr = scoreBoard.result.slice(0, 5);
    for (let i = 0; i < scoreArr.length; i += 1) {
      const count = i + 1;
      const row = content.insertRow(0);
      row.setAttribute('data-index', `${i}`);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const sorted = sorter(scoreArr);
      [cell1.innerHTML, cell2.innerHTML, cell3.innerHTML] = [count, sorted[i][0], sorted[i][1]];
    }
  }
}
