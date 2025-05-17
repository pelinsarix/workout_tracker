const User = require('../models/User');

// @desc    Atualizar perfil do usuário
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.nome = req.body.nome || user.nome;
      user.email = req.body.email || user.email;
      user.peso = req.body.peso !== undefined ? req.body.peso : user.peso;
      user.altura = req.body.altura !== undefined ? req.body.altura : user.altura;
      user.idade = req.body.idade !== undefined ? req.body.idade : user.idade;
      user.fotoPerfil = req.body.fotoPerfil || user.fotoPerfil;

      // Se a senha estiver incluída, será atualizada (e hash aplicado via middleware)
      if (req.body.senha) {
        user.senha = req.body.senha;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        peso: updatedUser.peso,
        altura: updatedUser.altura,
        idade: updatedUser.idade,
        fotoPerfil: updatedUser.fotoPerfil,
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro do servidor' });
  }
};

module.exports = { updateUserProfile };
