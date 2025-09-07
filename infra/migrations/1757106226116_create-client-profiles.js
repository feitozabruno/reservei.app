exports.up = (pgm) => {
  pgm.createTable("client_profiles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    user_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: '"users"',
      onDelete: "cascade",
    },

    full_name: {
      type: "varchar(50)",
      notNull: true,
    },

    phone_number: {
      type: "varchar(15)",
      notNull: true,
    },

    profile_photo_url: {
      type: "text",
    },

    is_phone_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
