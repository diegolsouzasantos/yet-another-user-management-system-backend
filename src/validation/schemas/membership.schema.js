const { z } = require('zod');
const idPrimitive = require('../primitives/id.primitive');

const idList = z.array(idPrimitive).min(1).max(100);

module.exports = {
  addGroups: z.object({ groupIds: idList }),
  groupParams: z.object({ id: idPrimitive, groupId: idPrimitive }),
  addUsers: z.object({ userIds: idList }),
  userParams: z.object({ id: idPrimitive, userId: idPrimitive }),
  addPermissions: z.object({ permissionIds: idList }),
  permissionParams: z.object({ id: idPrimitive, permissionId: idPrimitive }),
};
