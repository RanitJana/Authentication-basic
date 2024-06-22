const userSchema = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const checkUserLoggedIn = async function (req, res, next) {
    try {

        let token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized user"
            })
        }

        jwt.verify(token, process.env.JWT_ACCESSTOKEN_SIGN, async (err, decodedToken) => {

            if (err) {

                if (err.name == 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Session expired!! Please log in again!!"
                    })
                }

                return res.status(401).json({
                    message: "An error occurred!!"
                })

            }

            let user = await userSchema.findById(decodedToken?._id);

            if (!user) {

                return res.status(401).json({
                    message: 'Invalid token!!'
                });
            }

            return next();
        });

    } catch (error) {

        console.log(`An error occurred!! ${error}`);
        throw error;
    }
}

module.exports = {
    checkUserLoggedIn
}