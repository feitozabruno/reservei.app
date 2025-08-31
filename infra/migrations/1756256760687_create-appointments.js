const APPOINTMENT_STATUS_TYPE = "appointment_status";

exports.up = (pgm) => {
  pgm.createType(APPOINTMENT_STATUS_TYPE, [
    "PENDING",
    "SCHEDULED",
    "CONFIRMED_BY_PROFESSIONAL",
    "CANCELED_BY_CLIENT",
    "CANCELED_BY_PROFESSIONAL",
    "COMPLETED",
  ]);

  pgm.createTable("appointments", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    client_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "SET NULL",
    },

    professional_id: {
      type: "uuid",
      notNull: true,
      references: '"professional_profiles"',
      onDelete: "cascade",
    },

    start_time: { type: "timestamptz", notNull: true },
    end_time: { type: "timestamptz", notNull: true },

    status: {
      type: APPOINTMENT_STATUS_TYPE,
      notNull: true,
      default: "SCHEDULED",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "appointments",
    "start_before_end_check",
    "CHECK (start_time < end_time)",
  );

  pgm.createIndex("appointments", "client_id");
  pgm.createIndex("appointments", "professional_id");
  pgm.createIndex("appointments", "start_time");
};

exports.down = false;
