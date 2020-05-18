/* eslint-disable import/no-cycle */
/* eslint-disable no-alert */
import {
  currentPlayer, getCurrentPlayer, currentScore, getCurrentScore,
} from './localStorage';
import { submitScore, getScoreBoard } from './backEndConnect';

import { score } from './scenes/battle';

const scoreBoard = async () => {
  let list = `<h1 class="header">LeaderBoard</h1>
  <h4><span>Rank</span><span>Name</span><span>Score</span></h4>`;
  const leaderBoard = await getScoreBoard();
  leaderBoard.forEach((el) => {
    list += `<h4><span>${leaderBoard.indexOf(el) + 1}</span><span>${
      el[0]
    }</span><span>${el[1]}</span></h4>`;
  });
  return list;
};

const render = async () => {
  const data = await scoreBoard();
  document.getElementById('leaderboard').innerHTML = data;
};

render();

const submit = document.getElementById('play');
const from = document.getElementById('user-name');
const div = document.getElementById('username');

if (getCurrentPlayer()) {
  from.style.display = 'none';
  div.style.display = 'none';
}

const hide = () => {
  const player = document.getElementById('user-name').value;
  currentPlayer(player);
  from.style.display = 'none';
  div.style.display = 'none';
};

submit.addEventListener('click', hide);
window.addEventListener('keypress', (ev) => {
  if (ev.keyCode === 13 && !getCurrentPlayer()) {
    hide();
    ev.preventDefault();
  }
});

const liveUpdate = () => {
  if (score > getCurrentScore()) {
    currentScore(score);
    submitScore(getCurrentPlayer(), getCurrentScore()).then(render());
  }
};

export default liveUpdate;
