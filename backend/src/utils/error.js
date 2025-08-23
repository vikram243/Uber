// backend/src/middleware/error.js
export function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.originalUrl}`,
    });
}


export function errorHandler(err, req, res, _next) {
    // Avoid leaking stack in prod
    const status = err.statusCode || err.status || 500;
    const payload = {
        success: false,
        message: err.message || 'Internal Server Error',
    };
    if (process.env.NODE_ENV !== 'production') {
        payload.stack = err.stack;
        payload.details = err.details;
    }
    // Example: handle common Mongoose errors
    if (err.name === 'ValidationError') {
        payload.message = 'Validation Error';
        payload.errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json(payload);
    }
    if (err.name === 'CastError') {
        payload.message = 'Invalid ID format';
        return res.status(400).json(payload);
    }
    res.status(status).json(payload);
}