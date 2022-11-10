module.exports = {
    dev: {
        apiUrl: "http://localhost:",
        port: 3000
    },
    production: {
        apiUrl: process.env.API_URL,
        port: process.env.port
    }
}