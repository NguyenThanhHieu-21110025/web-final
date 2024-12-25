const checkSubscriber = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'subscriber' && req.session.user.role !== 'writer' && req.session.user.role !== 'editor' && req.session.user.role !== 'administrator') {
        return res.status(403).send("You do not have permission to access this resource.");
    }
    next();
};

const checkWriter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'writer' && req.session.user.role !== 'editor' && req.session.user.role !== 'administrator') {
        return res.status(403).send("You do not have permission to access this resource.");
    }
    next();
};

const checkEditor = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('http://localhost:8080/api/auth/login');
    }
    if (req.session.user.role !== 'editor' && req.session.user.role !== 'administrator') {
        return res.status(403).send("You do not have permission to access this resource.");
    }
    next();
};

const checkAdministrator = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'administrator') {
        return res.status(403).send("You do not have permission to access this resource.");
    }
    next();
};
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.redirect('http://localhost:8080/api/auth/login');
};

module.exports = {
    checkSubscriber,
    checkWriter,
    checkEditor,
    checkAdministrator,
    ensureAuthenticated,
};
  