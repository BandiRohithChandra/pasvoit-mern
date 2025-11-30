// 404 Handler
export function notFound(req, res, next) {
    res.status(404).json({ message: "Route not found" });
}

// Global Error Handler
export function errorHandler(err, req, res, next) {
    console.error("Error:", err.message);
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error",
    });
}
