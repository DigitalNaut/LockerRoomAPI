exports.purge = (dataset, properties) => {
  if (!dataset) throw "Internal Error: Failed to purge sensitive data.";

  for (const value in dataset)
    if (dataset.hasOwnProperty(value))
      if (!properties.includes(value)) delete dataset[value];

  return dataset;
};
