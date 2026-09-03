const TRACKED_FIELDS = ['email', 'firstName', 'lastName', 'roleId', 'isActive'];

function buildUserDiffs(before, after) {
  return TRACKED_FIELDS
    .filter((field) => before[field] !== after[field])
    .map((field) => ({ field, oldValue: before[field], newValue: after[field] }));
}

module.exports = buildUserDiffs;
