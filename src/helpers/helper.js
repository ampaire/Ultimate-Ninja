/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

const score = require('../scenes/battle');

const scoreTextUpdate = (el) => {
  setInterval(() => {
    el.setText(`Score: ${score.score}`);
  }, 500);
};

const hpUpdate = (el) => {
  setInterval(() => el, 500);
};

const levelUpdate = (el) => {
  setInterval(() => {
    let level;
    if (score <= 50 && score >= 0) {
      level = 1;
    } else if (score <= 200 && score >= 50) {
      level = 2;
    } else {
      level = 3;
    }
    el.setText(`Level: ${level}`);
  }, 500);
};

const enemySelect = (currentScore) => {
  let index;
  const enemyarr = ['wizarus', 'wizarus2', 'wizarus3', 'ghostus', 'master'];
  if (currentScore <= 50 && currentScore >= 0) {
    index = Phaser.Math.RND.between(0, 2);
  } else if (currentScore <= 200 && currentScore >= 50) {
    index = Phaser.Math.RND.between(2, 3);
  } else {
    index = Phaser.Math.RND.between(3, 4);
  }
  return enemyarr[index];
};

const scoreUpdate = (Score) => {
  if (Score <= 50 && Score >= 0) {
    return 35;
  } if (Score <= 200 && Score >= 50) {
    return 50;
  }
  return 100;
};

const powerAssign = (el) => {
  switch (el) {
    case 'wizarus':
      return [80, 80];
    case 'wizarus2':
      return [90, 90];
    case 'wizarus3':
      return [110, 100];
    case 'ghostus':
      return [120, 150];
    case 'master':
      return [200, 150];
    default:
      return 50;
  }
};

export {
  enemySelect, scoreTextUpdate, levelUpdate, scoreUpdate, powerAssign, hpUpdate,
};