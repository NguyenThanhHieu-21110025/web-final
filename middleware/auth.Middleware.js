const jwt = require("jsonwebtoken");

const middlewareController = {
    // Middleware xác thực token
    verifyToken: (req, res, next) => {
        let token = req.headers["authorization"]?.split(" ")[1];
        
        // Nếu không có token trong header, kiểm tra trong cookie
        if (!token) {
            token = req.cookies.refreshtoken;
        }
        
        if (!token) {
            return res.status(401).json({ message: "Authentication token is missing" });
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid", error: err.message });
            }
            req.user = user;  // Gắn thông tin người dùng vào req
            next(); // Tiến hành tiếp
        });
    },
    
    

    // Middleware xác thực và kiểm tra quyền admin
    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            } else {
                return res.status(403).json({ message: "You are not allowed to do that" });
            }
        });
    },
    
    // Kiểm tra xem người dùng có được xác thực và token có hợp lệ không
    isAuthenticated: (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(401).json({ message: "Authentication token is missing" });
            }

            const [scheme, token] = authHeader.split(" ");
            if (scheme !== "Bearer" || !token) {
                return res.status(401).json({ message: "Invalid token format" });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Token is not valid", error: err.message });
                }
                req.user = user;
                next(); // Token hợp lệ, tiếp tục xử lý yêu cầu
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    // Kiểm tra nếu token hợp lệ qua cookie (nếu có)
    verifyTokenFromCookie: (req, res, next) => {
        const token = req.cookies.refreshtoken;
        
        if (!token) {
            return res.status(401).json({ message: "Authentication token is missing. Please ensure you include the Authorization header or the refresh token cookie." });
        }
        

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid", error: err.message });
            }
            req.user = user; // Gắn thông tin người dùng vào req
            next(); // Tiến hành tiếp
        });
    },
};

module.exports = middlewareController;
