const mongoose = require('mongoose')

const porukaSchema = new mongoose.Schema({
  sadrzaj: {
    type: String,
    minlength: 5,
    required: true
  },
  datum: {
    type: Date,
    required: true
  },
  vazno: {
    type: Boolean,
    default: false
  },
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Korisnik'
  }
})

porukaSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Poruka', porukaSchema, 'poruke')
