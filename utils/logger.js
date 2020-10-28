const info = (...poruke) => {
  if(process.env.NODE_ENV!=='test'){
    console.log(...poruke);

  }
}

const greska = (...poruke) => {
  console.error(...poruke);
}

module.exports = {info, greska}