function requireAuth(req, res, next) {
    if (!req.session || !req.session.adminId) {
        return res.redirect('/login');
    }

    next();
}

module.exports = requireAuth;