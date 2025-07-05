const USER_ROLE_TYPE = "user_role";

exports.up = (pgm) => {
  pgm.createType(USER_ROLE_TYPE, ["CLIENT", "PROFESSIONAL", "ADMIN"]);
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    email_verified_at: {
      type: "timestamptz",
    },

    role: {
      type: USER_ROLE_TYPE,
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
