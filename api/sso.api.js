const fetch = require('node-fetch');

const baseUrl = require('../baseUrl')

async function register(data, version) {
  try {
    const result = await fetch(baseUrl + `sso/register?version=${version}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const res = await result.json();
    return [res, result.status]
  } catch (err) {
    return err
  }
}

async function login(data) {
  try {
    const result = await fetch(baseUrl + 'sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const res = await result.json();
    return [res, result.status]
  } catch (err) {
    return err
  }
}

async function requestOtp(data) {
  const version = '1.0.0'
  try {
    const requestOtp = await fetch(baseUrl + `sso/login/request_otp?version=${version}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const res = await requestOtp.json();
    return [res, requestOtp.status]
  } catch (err) {
    return err
  }  
}

async function verifyOtp(data) {
  try {
    const verifyOtp = await fetch(baseUrl + 'sso/login/verify_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const res = await verifyOtp.json();
    return [res, verifyOtp.status]
  } catch (err) {
    return err
  }  
}

async function verifyToken(data, token) {
  try {
    const result = await fetch(baseUrl + `sso/verify-token?source=${data.source}&token=${data.token}&username=${data.username}&version=${data.version}`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    const res = await result.json();
    return [res, result.status]
  } catch (err) {
    return err
  }
}

async function getSharingCode(token) {
  try {
    const result = await fetch(baseUrl + `sso/get-sharing-code`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    const res = await result.json();
    return [res, result.status]
  } catch (err) {
    return err
  }
}

module.exports = { register, login, requestOtp, verifyToken, getSharingCode, verifyOtp }
