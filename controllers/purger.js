exports.purge = (properties, filter) => {
  if (!properties) throw "Internal Error: Failed to purge sensitive data.";

  for (const property in properties)
    if (properties.hasOwnProperty(property))
      if (!filter.includes(property)) {
        console.log("Deleted:", properties[property]);
        delete properties[property];
      }

  return properties;
};

// exports.protoPurger = (role, personal, privateFilter, publicFilter) => {
//   return purger.purge(
//     this.dataValues,
//     (personal ? privateFilter[role] : publicFilter) || publicFilter
//   );
// };
