const User = require("../models/user.Model");
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const {ne, fa} = require("@faker-js/faker");

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('guest/register', {errors: errors.array(), formData: req.body});
    }

    const {username, email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        return res.render('guest/register', {
            error: 'Mật khẩu và xác nhận mật khẩu không khớp.',
            formData: req.body
        });
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.render('guest/register', {
                error: "Email đã tồn tại.",
                formData: req.body
            });
        }

        const existingUsername = await User.findOne({username});
        if (existingUsername) {
            return res.render('guest/register', {
                error: "Tên người dùng đã tồn tại.",
                formData: req.body
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'guest',
        });

        await newUser.save();

        res.redirect('/api/auth/login');
    } catch (err) {
        console.error(err);
        res.render('guest/register', {
            error: 'Lỗi máy chủ trong quá trình đăng ký.',
            formData: req.body
        });
    }
};


const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).render('guest/login', {
                error: 'Email không tồn tại.',
                email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('guest/login', {
                error: 'Mật khẩu không chính xác.',
                email
            });
        }
        const inPremium = user?.subscriptionExpiry ? new Date().getTime() - new Date(user?.subscriptionExpiry).getTime() <= 0 : false;
        const expiredTime = user?.subscriptionExpiry
            ? new Date(user?.subscriptionExpiry).getTime() - new Date().getTime()
            : false;

        let timeLeftMessage = '';

        if (expiredTime !== null) {
            if (expiredTime > 0) {
                const days = Math.floor(expiredTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor((expiredTime / (1000 * 60 * 60)) % 24);

                if (days > 0) {
                    timeLeftMessage = `${days} day${days > 1 ? 's' : ''} left`;
                } else {
                    timeLeftMessage = `${hours} hour${hours > 1 ? 's' : ''} left`;
                }
            } else {
                timeLeftMessage = 'Subscription has expired.';
            }
        } else {
            timeLeftMessage = 'No subscription expiry date available.';
        }

        req.session.user = {
            userId: user?._id,
            email: user?.email,
            role: user?.role,
            username: user?.username,
            isPremium: inPremium,
            expiredTime: timeLeftMessage
        };

        return res.redirect('/guest/home');
    } catch (err) {
        console.error(err);
        return res.status(500).render('guest/login', {
            error: 'Lỗi máy chủ, vui lòng thử lại sau.'
        });
    }
};


const userLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message: 'Error during logout'});
        }
        res.clearCookie('connect.sid');
        return res.redirect('http://localhost:8080/guest/home');
    });
};


const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }
        await user.remove();
        res.status(200).json({message: 'User deleted successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error deleting user.'});
    }
};

const googleLogin = async (req, res) => {
    try {
        const {user} = req;
        req.session.user = {
            userId: user.id,
            email: user.email,
            role: 'guest'
        };
        res.redirect('/guest/home');
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error during Google login.'});
    }
};

const facebookLogin = async (req, res) => {
    try {
        const {user} = req;
        req.session.user = {
            userId: user.id,
            email: user.email,
            role: 'guest'
        };
        res.redirect('/guest/home');
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error during Facebook login.'});
    }
};

module.exports = {
    registerUser,
    loginUser,
    userLogout,
    deleteUser,
    googleLogin,
    facebookLogin,
};
