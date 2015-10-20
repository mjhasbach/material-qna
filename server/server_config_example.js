module.exports = {
    db: {
        // Add any desired Sequelize instantiation options to this object
        name: 'material_qna',
        username: 'material_qna',
        password: 'top secret',
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        pool: {
            max: 15,
            min: 0,
            idle: 10000
        }
    },
    session: {
        secret: 'top secret, bro',
        // the duration of login sessions in milliseconds
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    http: {
        port: 3000
    },
    cors: {
        port: 3001
    }
};