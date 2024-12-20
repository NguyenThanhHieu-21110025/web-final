const jwt = require("jsonwebtoken");

const middlewareController = {
    //verify token
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            //bearer 123456
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You are not authenticated");
        }
    },

    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.body.id == req.params.id || req.body.admin)
                next();
            else
                res.status(403).json("You are not allowed to do that");
        });
    },
    //validate phone number isVNmese
    // đảm baor người dùng đã đăng nhập và tk tồn tại
    isAuthenticated: (req, res, next) => {
        try {
            const authHeader = req.headers.authorization; // Lấy Authorization header
            if (!authHeader) {
                return res.status(401).json({message: "Authentication token is missing"});
            }

            // Kiểm tra xem header có bắt đầu bằng "Bearer"
            const [scheme, token] = authHeader.split(" ");
            if (scheme !== "Bearer" || !token) {
                return res.status(401).json({message: "Invalid token format"});
            }

            // Xác minh token
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({message: "Token is not valid", error: err.message});
                }
                req.user = user; // Gắn user vào req
                next(); // Chuyển tiếp
            });
        } catch (error) {
            res.status(500).json({message: "Internal server error", error: error.message});
        }
    }
}

module.exports = middlewareController;