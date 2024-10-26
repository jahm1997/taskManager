const mongoose = require('mongoose');
const { Schema } = mongoose;

const tareaSchema = new Schema({
  nombre: { type: String},
  empleado: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  administrador: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  descripcion: { type: String },
  prioridad: {type: Number},
  fechaEntrega: { type: Schema.Types.Date}
}, { timestamps: true });

module.exports = mongoose.model('Tarea', tareaSchema);
