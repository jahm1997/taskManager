const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, trim: true },
  usuario: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, //, select: false
  rol: { type: String, enum: ['administrador', 'empleado'], default: 'administrador' },
  usuarios: { type: Schema.Types.Array },
  lider: { type: Schema.Types.ObjectId }

}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
