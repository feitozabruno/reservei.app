exports.up = (pgm) => {
  pgm.createTable("professional_profiles", {
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

    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    full_name: {
      type: "varchar(50)",
      notNull: true,
    },

    phone_number: {
      type: "varchar(15)",
      notNull: true,
    },

    business_name: {
      type: "varchar(50)",
    },

    bio: {
      type: "varchar(200)",
    },

    specialty: {
      type: "varchar(100)",
      notNull: true,
    },

    profile_photo_url: {
      type: "text",
    },

    cover_picture_url: {
      type: "text",
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
