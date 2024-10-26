const mongoose = require('mongoose');
const { Schema } = mongoose;

const actividadSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  administrador: { type: Schema.Types.ObjectId, ref: 'Usuario' },
}, { timestamps: true });

module.exports = mongoose.model('Actividad', actividadSchema);
