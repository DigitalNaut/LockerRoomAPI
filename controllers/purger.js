exports.purge = function (properties) {
  if (!this) throw "Internal Error: Failed to purge sensitive data.";

  let values = Object.assign({}, this.get());

  if (values.dataValues)
    console.log("Yeet")

  for (const value in values)
    if (values.hasOwnProperty(value))
      if (!properties.includes(value)) delete values[value];

  return values;
};
