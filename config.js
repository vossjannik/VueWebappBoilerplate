const config = {
    primaryPort: 3000,
}

config.env = process.env.NODE_ENV && process.env.NODE_ENV.includes('dev')
    ? 'development'
    : 'production'

module.exports = config
