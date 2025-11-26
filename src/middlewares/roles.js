exports.permit = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ response: false, error: 'Unauthorized' });
  if (!allowed.includes(req.user.role)) return res.status(403).json({ response: false, error: 'Forbidden' });
  next();
};
