exports.up = (pgm) => {
  pgm.createTable("availabilities", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    professional_id: {
      type: "uuid",
      notNull: true,
      references: '"professional_profiles"',
      onDelete: "cascade",
    },
    day_of_week: {
      type: "integer",
      notNull: true,
    },
    start_time: { type: "time", notNull: true },
    end_time: { type: "time", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.addConstraint(
    "availabilities",
    "day_of_week_check",
    "CHECK (day_of_week >= 0 AND day_of_week <= 6)",
  );
  pgm.createIndex("availabilities", "professional_id");
};

exports.down = false;
