const porukeRouter = require('express').Router()
const Poruka = require('../models/poruka')
const Korisnik = require('../models/korisnik')

const jwt = require('jsonwebtoken')

porukeRouter.get('/', async (req, res) => {
  const poruke = await Poruka.find({})
  .populate('korisnik', {ime:1})

  res.json(poruke)
})
const dohvatiToken = req => {
  // iz cijelog zahtjeva dohvacamo samo 1 header
  const auth = req.get('authorization')
  // provjeravamo je li postoji
  if(auth && auth.toLowerCase().startsWith('bearer')){
    return auth.substring(7)
    // vraca cijeli token koji je BEARER{token}
  }
  return null
}
porukeRouter.get('/:id', (req, res, next) => {
  Poruka.findById(req.params.id)
    .then(poruka => {
      if (poruka) {
        res.json(poruka)
      } else {
        res.status(404).end()
      }

    })
    .catch(err => next(err))
})

porukeRouter.delete('/:id', async(req, res) => {
  
  const porukaId=req.params.id
  const poruka=await Poruka.findById(porukaId)
  const token = dohvatiToken(req)
  const dekToken=jwt.verify(token.process.env.SECRET)

  if(!token || !dekToken.id){
    return res.status(401).json({
      error: 'Neispravan token!!'
    })
  }
  if(dekToken.id!=poruka.korisnik){
    return res.status(401).json({
      error: 'Nije racun vlasnika'
    })
  }

  
  await Poruka.findByIdAndRemove(req.params.id)
  res.status(204).end()
    // .then(result => {
    //   res.status(204).end()
    // })
    // .catch(err => next(err))
})

porukeRouter.get('/:id', async (req, res) => {
  const poruka = await Poruka.findById(req.params.id)
  if (poruka) {
    res.json(poruka)
  } else {
    res.status(404).end()
  }
})
// porukeRouter.put('/:id', (req, res) => {
//   const podatak = req.body
//   const id = req.params.id

//   const poruka = {
//     sadrzaj: podatak.sadrzaj,
//     vazno: podatak.vazno
//   }

//   Poruka.findByIdAndUpdate(id,poruka, {new: true})
//   .then( novaPoruka => {
//     res.json(novaPoruka)
//   })
//   .catch(err => next(err))

// })
porukeRouter.put('/:id', async (req, res) => {
     const podatak = req.body
     const id = req.params.id
     const zeljena = await Poruka.findById(id)
     const token = dohvatiToken(req)
     const dekToken=jwt.verify(token, process.env.SECRET)
     if(!token || !dekToken.id){
      return res.status(401).json({
        error: 'Neispravan token!!'
      })
    }
    if(dekToken.id!=poruka.korisnik){
      return res.status(401).json({
        error: 'Nije racun vlasnika'
      })
    }
     const poruka = {
       sadrzaj: podatak.sadrzaj,
       vazno: podatak.vazno
     }
     
     Poruka.findByIdAndUpdate(id,poruka, {new: true})
     .then(novaP => {res.json(novaP)})
     .catch(err => next(err))
     /*.then( novaPoruka => {
       res.json(novaPoruka)
     })
     
     .catch(err => next(err))*/



})
porukeRouter.post('/', async (req, res, next) => {
  const podatak = req.body

  const token = dohvatiToken(req)
  const dekToken=jwt.verify(token, process.env.SECRET)
  //minjamo ovaj dio dole req.body.korisnikId samo defToken.id:
  if(!token || !dekToken.id){
    return res.status(401)
    .json({error:'ne postoji token ili pogresan token'}) //neautoriziran
  }
  const korisnik = await Korisnik.findById(dekToken.id)
  

  const poruka = new Poruka({
    sadrzaj: podatak.sadrzaj,
    vazno: podatak.vazno || false,
    datum: new Date(),
    korisnik: korisnik._id
  })
  const spremljenaPoruka = await poruka.save()
  korisnik.poruke = korisnik.poruke.concat(spremljenaPoruka._id)
  await korisnik.save()
  res.json(spremljenaPoruka)

  // poruka.save()
  // .then(spremljenaPoruka => {
  //   res.json(spremljenaPoruka)
  // })
  // .catch(err => next(err))
})

module.exports = porukeRouter