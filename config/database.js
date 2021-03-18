

if (process.env.NODE_ENV === 'prod') {
    module.exports = {

        mongodbUrl: process.env.MONGODB_URI
    }
} else {
    module.exports = {
        mongodbUrl: 'mongodb://localhost:27017/cms'
    }
}