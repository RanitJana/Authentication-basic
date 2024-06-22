
const userSchema = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const generateAccessTokenAndRefreshToken = (user) => {

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {
        accessToken,
        refreshToken
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const userRegister = async function (req, res, next) {

    try {
        const { userName, email, password } = req.body;

        let user = await userSchema.findOne({
            $or: [{ userName }, { email }]
        });


        if (user) {
            return res.status(401).json({
                message: 'User already exist.'
            })
        }

        user = await userSchema.create({
            userName: userName,
            email: email,
            password: password
        })

        const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(user);

        user.refreshToken = refreshToken;

        user.save({ validateBeforeSave: false });

        res.cookie('accessToken', accessToken, cookieOptions);

        // res.redirect('/login');

        return res.status(200).json({
            message: 'successfully registered'
        })
    } catch (error) {

        console.log('An error occurred!! Error :', error);
        throw error;
    }
}

const userLogin = async function (req, res, next) {
    try {

        const { email, password } = req.body;

        let user = await userSchema.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: 'This email is not registered!!'
            });
        }

        if (!user.isPasswordMatch(password)) {

            return res.status(401).json({
                message: 'Wrong Password!!'
            });
        }

        const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(user);

        user.refreshToken = refreshToken;

        user.save({ validateBeforeSave: false });

        res.cookie('accessToken', accessToken, cookieOptions);

        return res.status(200).json({
            message: "Login successful!!"
        })

    } catch (error) {

        console.log('An error occurred!! Error :', error);
        throw error;
    }

}

const userLogout = async function (req, res, next) {

    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
    if (!token) {

        return res.status(401).json({
            message: "Invaild Token!!"
        })
    }

    jwt.verify(token, process.env.JWT_ACCESSTOKEN_SIGN, async (err, decodedToken) => {

        userSchema.findByIdAndUpdate(
            decodedToken?._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )

        res.clearCookie('accessToken', cookieOptions).status(200).json({
            message: "logged out!!"
        })

    })
}

module.exports = {
    userRegister,
    userLogin,
    userLogout
}