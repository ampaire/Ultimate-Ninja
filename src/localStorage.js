const player = (params) => {
  const currentP = JSON.stringify(params);
  window.localStorage.setItem('currentP', currentP);
  return (currentP);
};

const getplayer = () => {
  const currentP = localStorage.getItem('currentP');
  return JSON.parse(currentP);
};

const currentScore = (params = 0) => {
  const currentP = JSON.stringify(params);
  window.localStorage.setItem('currentS', currentP);
  return (currentP);
};

const getScore = () => {
  const currentP = localStorage.getItem('currentS');
  return JSON.parse(currentP);
};

export {
  player, getplayer, currentScore, getScore,
};