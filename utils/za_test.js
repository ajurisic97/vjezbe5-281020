const palindrom = (tekst) => {
    return tekst.split('').reverse().join('')
  }
  
  const prosjek = (niz) => {  
    let suma = niz.reduce((rez, el) => {
      return rez + el
    }, 0)
    return niz.length === 0 ? 0 : suma / niz.length
  }
  
  module.exports = {palindrom, prosjek}