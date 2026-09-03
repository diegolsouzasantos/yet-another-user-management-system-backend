const db = require('../db/models');

function insertLog(actorUserId, entityType, entityId, action, field, transaction) {
  return db.AuditLog.create({
    actorUserId,
    entityType,
    entityId,
    action,
    fieldName: field ? field.field : null,
    oldValue: field ? String(field.oldValue) : null,
    newValue: field ? String(field.newValue) : null,
  }, { transaction });
}

async function recordChange(actorUserId, entityType, entityId, fields, transaction) {
  await Promise.all(fields.map((field) => insertLog(actorUserId, entityType, entityId, 'updated', field, transaction)));
}

function recordCreate(actorUserId, entityType, entityId, transaction) {
  return insertLog(actorUserId, entityType, entityId, 'created', null, transaction);
}

function recordDelete(actorUserId, entityType, entityId, transaction) {
  return insertLog(actorUserId, entityType, entityId, 'deleted', null, transaction);
}

module.exports = { recordChange, recordCreate, recordDelete };
