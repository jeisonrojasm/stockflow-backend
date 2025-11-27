const { User } = require('../models');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'client')
});

/**
 * @api {post} /api/auth/register Registrar un nuevo usuario
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Creates a new user in the system.  
 * Only Admins can later create/delete other users, but registration is public.
 *
 * @apiBody {String} name User's full name.
 * @apiBody {String} email Valid email address. Must be unique.
 * @apiBody {String{6..}} password Minimum 6 characters.
 * @apiBody {String="admin","client"} [role="admin"] Defaults to "admin" if not provided.
 *
 * @apiExample {json} Request Example:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "123456",
 *   "role": "admin"
 * }
 *
 * @apiSuccess {Boolean} response Always `true` when successful.
 * @apiSuccess {Object} data User information.
 * @apiSuccess {Number} data.id User ID.
 * @apiSuccess {String} data.email Registered email.
 * @apiSuccess {String="admin","client"} data.role The user's assigned role.
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *   "response": true,
 *   "data": {
 *     "id": 5,
 *     "email": "john@example.com",
 *     "role": "admin"
 *   }
 * }
 *
 * @apiError (400 Validation Error) ValidationError Some required fields are missing or invalid.
 * @apiError (409 Conflict) EmailExists Email already in use.
 *
 * @apiErrorExample {json} Email already exists:
 * {
 *   "response": false,
 *   "error": "Email already in use"
 * }
 *
 * @apiErrorExample {json} Validation Error:
 * {
 *   "response": false,
 *   "error": "\"password\" length must be at least 6 characters long"
 * }
 */
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

/**
 * @api {post} /api/auth/login Iniciar sesión con un usuario
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Authenticates a user with email and password.  
 * Returns a JSON Web Token (JWT) for authenticated requests.
 *
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 *
 * @apiExample {json} Request Example:
 * {
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 *
 * @apiSuccess {Boolean} response Always `true` when login succeeds.
 * @apiSuccess {Object} data Token data.
 * @apiSuccess {String} data.token JWT token valid for the configured expiration time.
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *   "response": true,
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 *
 * @apiError (400 Validation Error) ValidationError Invalid or missing fields.
 * @apiError (401 Unauthorized) InvalidCredentials Invalid email or password.
 *
 * @apiErrorExample {json} Invalid credentials:
 * {
 *   "response": false,
 *   "error": "Invalid credentials"
 * }
 *
 * @apiErrorExample {json} Validation Error:
 * {
 *   "response": false,
 *   "error": "\"email\" must be a valid email"
 * }
 */
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
