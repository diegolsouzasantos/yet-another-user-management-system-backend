const db = require('../db/models');
const { comparePassword } = require('../modules/auth/password.service');
const UnauthorizedError = require('../errors/unauthorized-error');
const AppError = require('../errors/app-error');
const { recordChange } = require('../audit/audit-log.service');

async function transferOwnership({ currentOwner, targetUserId, currentPassword }) {
  const passwordMatches = await comparePassword(currentPassword, currentOwner.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError('errors.invalid_credentials');
  }

  const target = await db.User.findByPk(targetUserId, { include: [db.Role] });
  if (!target || !target.Role.grantsAllPermissions) {
    throw new AppError(422, 'errors.owner_transfer_invalid_target');
  }

  await db.sequelize.transaction(async (transaction) => {
    await currentOwner.update({ isOwner: false }, { transaction });
    await target.update({ isOwner: true }, { transaction });

    await recordChange(currentOwner.id, 'User', currentOwner.id, [
      { field: 'isOwner', oldValue: 'true', newValue: 'false' },
    ], transaction);
    await recordChange(currentOwner.id, 'User', target.id, [
      { field: 'isOwner', oldValue: 'false', newValue: 'true' },
    ], transaction);
  });

  return target;
}

module.exports = transferOwnership;
