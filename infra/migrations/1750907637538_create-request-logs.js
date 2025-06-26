exports.up = (pgm) => {
  pgm.createTable("request_logs", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    ip_address: {
      type: "inet",
      notNull: true,
    },

    event_type: {
      type: "text",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.createIndex("request_logs", ["ip_address", "created_at"]);
};

exports.down = false;
