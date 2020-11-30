exports.filters = (() => {
  let rules = {
    locker: {
      admin: ["updatedAt", "createdAt"],
      user: [],
      public: ["id", "location", "user", "alias"],
    },

    message: {
      admin: ["updatedAt"],
      user: ["subject", "body", "footer", "createdAt"],
      public: ["id", "sender", "recipient"],
    },

    event: {
      admin: [
        "createdAt",
        "updatedAt",
        "creator",
        "type",
        "userFilter",
        "template",
      ],
      user: ["about", "mandatory", "expDate"],
      public: ["title", "code"],
    },

    petition: {
      admin: ["updatedAt", "createdAt"],
      user: ["enclosure", "result", "resultMessage"],
      public: ["id", "sender", "type", "code"],
    },

    user: {
      admin: ["updatedAt", "createdAt"],
      user: [
        "password",
        "authToken",
        "email",
        "firstN0ame",
        "lastName",
        "DOB",
        "address",
        "phone",
      ],
      public: ["username", "role"],
    },
  };

  for (const filter in rules) {
    if (rules.hasOwnProperty(filter)) {
      const rule = rules[filter];
      rule.user = rule.user.concat(rule.public);
      rule.admin = rule.admin.concat(rule.user);
    }
  }

  return rules;
})();
