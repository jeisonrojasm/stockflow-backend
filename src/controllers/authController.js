const { User } = require('../models');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'client')
});

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ response: false, error: error.message });

    const existing = await User.findOne({ where: { email: value.email } });
    if (existing) return res.status(409).json({ response: false, error: 'Email already in use' });

    const user = await User.create(value);
    res.json({ response: true, data: { id: user.id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ response: false, error: error.message });

    const user = await User.findOne({ where: { email: value.email } });
    if (!user) return res.status(401).json({ response: false, error: 'Invalid credentials' });

    const valid = await user.validatePassword(value.password);
    if (!valid) return res.status(401).json({ response: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ response: true, data: { token } });
  } catch (err) { next(err); }
};
