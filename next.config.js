module.exports = {
    env: {
        AUTH_SECRET: process.env.AUTH_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}