const createMsm = (userName, msm) => {
  return {
    name: userName,
    msm,
    date: new Date(),
  };
};

module.exports = { createMsm };
