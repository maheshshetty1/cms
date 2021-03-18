

if (process.env.NODE_ENV === 'prod') {
    module.exports = {

        mongodbUrl: 'mongodb+srv://cms-user:cms123@cms.3uyks.mongodb.net/cms?retryWrites=true&w=majority'
    }
} else {
    module.exports = {
        mongodbUrl: 'mongodb://localhost:27017/cms'
    }
}