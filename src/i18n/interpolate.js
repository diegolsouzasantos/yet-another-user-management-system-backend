function interpolate(template, vars) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  ));
}

module.exports = interpolate;
