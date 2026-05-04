// Middleware adminOnly - debe encadenarse DESPUÉS de authMiddleware.
// Bloquea con 403 si el usuario no es ADMIN.

module.exports = function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Solo administradores pueden realizar esta acción" });
  }
  next();
};
