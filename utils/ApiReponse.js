class ApiResponse {
    static success(res, message, data, statusCode) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static success(res, data) {
        return res.status(200).json(data);
    }

    static success(res) {
        return res.status(200).json({})
    }

    static error(res, message, errors, statusCode) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }

    static error(res, code) {
        return ApiResponse.error(res, "Internal Server Error", null, code)
    }

    static validationError(res, errors, statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            message: 'Validation error',
            errors,
        });
    }

    static notFound(res, message = 'Resource not found', statusCode = 404) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}

module.exports = ApiResponse;