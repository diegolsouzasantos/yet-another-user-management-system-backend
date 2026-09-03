const SOURCE_ORDER = ['role', 'group', 'direct'];

function toEffectivePermissions(user) {
  const byId = new Map();

  const add = (permission, source) => {
    if (!byId.has(permission.id)) {
      byId.set(permission.id, {
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        sources: [],
      });
    }
    const entry = byId.get(permission.id);
    if (!entry.sources.includes(source)) entry.sources.push(source);
  };

  ((user.Role && user.Role.Permissions) || []).forEach((permission) => add(permission, 'role'));
  (user.Groups || []).forEach((group) => (group.Permissions || []).forEach((permission) => add(permission, 'group')));
  (user.Permissions || []).forEach((permission) => add(permission, 'direct'));

  return [...byId.values()]
    .map((entry) => ({
      ...entry,
      sources: entry.sources.sort((a, b) => SOURCE_ORDER.indexOf(a) - SOURCE_ORDER.indexOf(b)),
    }))
    .sort((a, b) => `${a.resource}:${a.action}`.localeCompare(`${b.resource}:${b.action}`));
}

module.exports = toEffectivePermissions;
