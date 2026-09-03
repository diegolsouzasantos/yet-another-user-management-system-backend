const { randomUUID } = require('crypto');
const env = require('../../config/env');
const { hashPassword } = require('../../modules/auth/password.service');

module.exports = {
  up: async (queryInterface) => {
    const [[existingUser]] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = :email',
      { replacements: { email: env.OWNER_ADMIN_EMAIL } },
    );

    if (existingUser) {
      return;
    }

    const [[adminRole]] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Administrator'",
    );
    const passwordHash = await hashPassword(env.OWNER_ADMIN_PASSWORD);
    const now = new Date();

    await queryInterface.bulkInsert('users', [{
      id: randomUUID(),
      email: env.OWNER_ADMIN_EMAIL,
      password_hash: passwordHash,
      first_name: env.OWNER_ADMIN_FIRST_NAME,
      last_name: env.OWNER_ADMIN_LAST_NAME,
      role_id: adminRole.id,
      is_owner: true,
      is_active: true,
      created_at: now,
      updated_at: now,
    }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: env.OWNER_ADMIN_EMAIL });
  },
};
