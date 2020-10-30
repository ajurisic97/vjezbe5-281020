const bcrypt = require('bcrypt')
const korisniciRouter = require('express').Router()

const Korisnik = require('../models/korisnik')


//stvaranje novog korisnika:
korisniciRouter.post('/', async (req, res) => {
    // sadrzaj zahtjeva (podaci)
    const sadrzaj = req.body
    // u bodyu bi nam trebao poslati objekt koji izgleda otpr ovako
    //{username:'',pass:''}

    const runde = 10
    // funkcija hash. Saljemo vrijednost koju zelimo hashirat tj sadrzaj.pass
    // drugi parametar - br rundi koliko puta ce vrtit ovu hash funkciju
    // to ne znaci da ce je vrtit 10 puta nego je to vjer 2 na 10

    const passHash = await bcrypt.hash(sadrzaj.pass, runde)
   

    // nakon kriptiranja sifre mozemo praviti korisnika
    // radimo novi model korisnika
    const korisnik = new Korisnik({
      username : sadrzaj.username,
      ime: sadrzaj.ime,
      passHash
    })
   
    const noviKorisnik = await korisnik.save()
    res.json(noviKorisnik)
})

korisniciRouter.get('/',async(req,res)=>{
    const svi = await Korisnik
    .find({})
    .populate('poruke',{sadrzaj: 1, datum: 1})
    res.json(svi)
})
module.exports=korisniciRouter