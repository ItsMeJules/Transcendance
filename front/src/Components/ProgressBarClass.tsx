const getProgressBarClass = (level: any) => {
  if (level < 0.5) return 'progress-bar00';
  else if (level >= 0.5 && level < 1.5) return 'progress-bar01';
  else if (level >= 1.5 && level < 2.5) return 'progress-bar02';
  else if (level >= 2.5 && level < 3.5) return 'progress-bar03';
  else if (level >= 3.5 && level < 4.5) return 'progress-bar04';
  else if (level >= 4.5 && level < 5.5) return 'progress-bar05';
  else if (level >= 5.5 && level < 6.5) return 'progress-bar06';
  else if (level >= 6.5 && level < 7.5) return 'progress-bar07';
  else if (level >= 7.5 && level < 8.5) return 'progress-bar08';
  else if (level >= 8.5 && level < 9.5) return 'progress-bar09';
  else if (level >= 9.5) return 'progress-bar10';
  else return 'progress-bar00';
};

export default getProgressBarClass;