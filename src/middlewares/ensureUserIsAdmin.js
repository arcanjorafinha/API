const AppError = require('../utils/AppError');

function ensureUserIsAdmin(roleToVerify) {
    return (request, response, next) => {
        const { role } = request.user;

        if (role !== roleToVerify) {
            throw new AppError('Você não possui permissão para realizar esta ação.', 401);
        }

        return next();
    };
}

module.exports = ensureUserIsAdmin;