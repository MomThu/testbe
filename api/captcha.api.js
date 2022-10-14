const fetch = require('node-fetch');

const baseUrl = require('../baseUrl')

async function getCaptcha() {
  try {
    const captcha = await fetch(baseUrl + 'captcha')
    const res = await captcha.json()
    return [res, captcha.status]
  } catch (err) {
    return err
  }
}

module.exports = { getCaptcha }