const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true
  },
  peso: {
    type: Number,
    default: null
  },
  altura: {
    type: Number,
    default: null
  },
  idade: {
    type: Number,
    default: null
  },
  fotoPerfil: {
    type: String,
    default: null
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Método para comparar senha
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.senha);
};

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
