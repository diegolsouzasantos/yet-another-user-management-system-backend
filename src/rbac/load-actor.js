const db = require('../db/models');

function loadActor(userId) {
  return db.User.findByPk(userId, {
    include: [
      { model: db.Role, include: [{ model: db.Permission }] },
      { model: db.Permission },
      { model: db.Group, include: [{ model: db.Permission }] },
    ],
  });
}

module.exports = loadActor;
