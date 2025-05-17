const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwtsecret123', {
    expiresIn: '30d',
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    // Criar novo usuário
    const user = await User.create({
      nome,
      email,
      senha,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nome: user.nome,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro do servidor' });
  }
};

// @desc    Autenticar usuário & obter token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(senha))) {
      res.json({
        _id: user._id,
        nome: user.nome,
        email: user.email,
        peso: user.peso,
        altura: user.altura,
        idade: user.idade,
        fotoPerfil: user.fotoPerfil,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro do servidor' });
  }
};

// @desc    Verificar token e obter dados do usuário
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-senha');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro do servidor' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
