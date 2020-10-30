const bcrypt = require('bcrypt')
const Korisnik = require('../models/korisnik')
const pomocni = require('../tests/pomocni')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

  beforeEach(async () => {
    await Korisnik.deleteMany({})

    const passHash = await bcrypt.hash('tajna', 10)
    const korisnik = new Korisnik({
        username: 'admin',
        ime:'Administrator',
        passHash
    })
    await korisnik.save()
  })
  
  test('stvaranje novog korisnika', async () =>{
    const pocetniKorisnici = await pomocni.korisniciIzBaze()

    const novi = {
      username: 'ajurisic',
      ime: 'Andelo Jurisic',
      pass: 'ajurisic'
    }

    await api
    .post('/api/korisnici')
    .send(novi)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const korisniciKraj = await pomocni.korisniciIzBaze()
    expect(korisniciKraj).toHaveLength(pocetniKorisnici.length + 1)

    const svaImena = korisniciKraj.map(k => k.username)
    expect(svaImena).toContain(novi.username)
  })


  test('ispravno vraca pogresku ako vec postoji username', async () =>{
    const pocetniKorisnici = await pomocni.korisniciIzBaze()

    const novi = {
      username: 'admin',
      ime: 'Andelo Jurisic',
      pass: 'oarwa'
    }

    const rezultat = await api
    .post('/api/korisnici')
    .send(novi)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    expect(rezultat.body.error).toContain('`username` to be unique')

    const korKraj = await pomocni.korisniciIzBaze()
    expect(korisniciKraj).toHaveLength(pocetniKorisnici.length)
  })
  afterAll(async () => {
    await mongoose.connection.close()
  })
