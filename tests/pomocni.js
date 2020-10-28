const Poruka = require('../models/poruka')	

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

const porukeIzBaze = async () => {
  const poruke = await Poruka.find({})
  return poruke.map(p => p.toJSON())
}


module.exports = {
  pocetnePoruke, porukeIzBaze
}