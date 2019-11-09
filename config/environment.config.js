if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable not provided');
  process.exit(1);
}

if (!process.env.JWT_EXPIRES) {
  throw new Error('JWT_EXPIRES environment variable not provided');
  process.exit(1);
}

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL environment variable not provided');
  process.exit(1);
}

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME environment variable not provided');
  process.exit(1);
}

module.exports = {
  server: {
    port: process.env.PORT,
    ssl: process.env.SSL
  },
  database: {
    connectionString: process.env.MONGODB_URL,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    attributes: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },
  uploadPath: process.env.UPLOAD_PATH,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES
}