const adjustPermissionCatalogue = require('./helpers/adjust-permission-catalogue');

module.exports = {
  up: (queryInterface) => adjustPermissionCatalogue(queryInterface),
  down: async () => {},
};
