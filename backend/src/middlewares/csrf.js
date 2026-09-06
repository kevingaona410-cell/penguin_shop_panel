const crypto = require('crypto');

function csrfToken(req, res, next) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }

    res.locals.csrfToken = req.session.csrfToken;

    next();
}

function verifyCSRF(req, res, next) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (safeMethods.includes(req.method)) {
        return next();
    }

    const sessionToken = req.session.csrfToken;
    const requestToken = req.body._csrf;

    if (!sessionToken || !requestToken) {
        const error = new Error('Token CSRF inválido');
        error.status = 403;
        return next(error);
    }

    const sessionBuffer = Buffer.from(sessionToken);
    const requestBuffer = Buffer.from(requestToken);

    if (
        sessionBuffer.length !== requestBuffer.length ||
        !crypto.timingSafeEqual(sessionBuffer, requestBuffer)
    ) {
        const error = new Error('Token CSRF inválido');
        error.status = 403;
        return next(error);
    }

    next();
}

module.exports = {
    csrfToken,
    verifyCSRF
};