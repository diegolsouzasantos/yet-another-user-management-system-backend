function parseSort(query, allowedFields, defaultOrder) {
  if (!query || !allowedFields.includes(query.sort)) {
    return [defaultOrder];
  }

  const direction = String(query.order || '').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return [[query.sort, direction]];
}

module.exports = { parseSort };
