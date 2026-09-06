function getValidationErrors(error) {
    return Object.fromEntries(
        Object.entries(error.errors || {}).map(([field, fieldError]) => [
            field,
            fieldError.message
        ])
    );
}

function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}

module.exports = {
    getValidationErrors,
    createNotFound
};
