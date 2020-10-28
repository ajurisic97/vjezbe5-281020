const mongoose = require('mongoose')
const {TestScheduler} = require('jest')
const supertest = require('supertest')
const app = require('../app')
const Poruka = require("../models/poruka")

const pomocni = require('./pomocni')
const api = supertest(app)

const pocetnePoruke = [
    {
      id: 1,
      sadrzaj: 'HTML je jednostavan',
      datum: '2019-05-30T17:30:31.098Z',
      vazno: true
    },
    {
      id: 2,
      sadrzaj: 'React koristi JSX sintaksu',
      datum: '2019-05-30T18:39:34.091Z',
      vazno: false
    },
    {
      id: 3,
      sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
      datum: '2019-05-30T19:20:14.298Z',
      vazno: true
    }
  ]
  beforeEach( async () => {
    await Poruka.deleteMany({})
    let objektPoruka = new Poruka(pomocni.pocetnePoruke[0])
    await objektPoruka.save()
    objektPoruka = new Poruka(pomocni.pocetnePoruke[1])
    await objektPoruka.save()
    objektPoruka = new Poruka(pomocni.pocetnePoruke[2])
    await objektPoruka.save()
  })

test('poruke se vraćaju kao JSON', async () => {
  await api
    .get('/api/poruke')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('baza ima točno 3 poruke',async () => {
    const odgovor = await api.get('/api/poruke')
    expect(odgovor.body).toHaveLength(pomocni.pocetnePoruke.length)
})

	
test('Provjera prve poruke', async () => {
    const odgovor = await api.get('/api/poruke')
    const sadrzaj = odgovor.body.map(p=>p.sadrzaj)
    expect(sadrzaj).toContain('HTML je jednostavan')
  })

//novi testovi

test('dodavanje ispravne poruke',async()=>{
    const nova = {
        sadrzaj: 'Poruka iz testa',
        vazno: true
    }

    await api
    .post('/api/poruke')
    .send(nova)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    const odgovor = await pomocni.porukeIzBaze()
    const sadrzaj = odgovor.map(p=>p.sadrzaj)

    expect(sadrzaj).toContain('Poruka iz testa')
    expect(odgovor).toHaveLength(pomocni.pocetnePoruke.length+1)
})
  

test('ispravno vraca pogresku kod spremanja poruke bez sadrzaja',async()=>{
    const nova = {
        vazno: true
    }

    await api
    .post('/api/poruke')
    .send(nova)
    .expect(400)
    
    const odgovor = await pomocni.porukeIzBaze()

    expect(odgovor).toHaveLength(pomocni.pocetnePoruke.length)
})

test('dohvat specificne poruke', async () => {
    const porukePocetak = await pomocni.porukeIzBaze()
    const trazenaPoruka = porukePocetak[0]
  
    const odgovor = await api
    .get(`/api/poruke/${trazenaPoruka.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
    const jsonPoruka = JSON.parse(JSON.stringify(trazenaPoruka))
    expect(odgovor.body).toEqual(jsonPoruka)
  })

test('ispravno brisanje poruke', async () => {
    const porukePocetak = await pomocni.porukeIzBaze()
    const porukaZaBrisanje = porukePocetak[0]
  
    const odgovor = await api
      .delete(`/api/poruke/${porukaZaBrisanje.id}`)
      .expect(204)
  
    const porukeKraj = await pomocni.porukeIzBaze()
    expect(porukeKraj).toHaveLength(porukePocetak.length - 1)
  
    const sadrzaj = porukeKraj.map(p => p.sadrzaj)
    expect(sadrzaj).not.toContain(porukaZaBrisanje.sadrzaj)
  
  })

afterAll(() => {
  mongoose.connection.close()
})