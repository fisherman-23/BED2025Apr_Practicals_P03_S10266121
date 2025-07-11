const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('member', 'librarian').required().messages({
    'any.only': 'Role must be either "member" or "librarian"',
    'any.required': 'Role is required'
  })
});


const userLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base':   'Username must be a string',
    'any.required':  'Username is required'
  }),
  password: Joi.string().required().messages({
    'string.base':   'Password must be a string',
    'any.required':  'Password is required'
  })
});

function validateUserRegistration(req, res, next) {
  const { error } = userRegistrationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  next();
}

function validateLogin(req, res, next) {
  const { error } = userLoginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ error: messages });
  }
  next();
}

module.exports = { validateUserRegistration, validateLogin };