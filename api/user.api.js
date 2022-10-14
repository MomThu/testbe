const fetch = require('node-fetch');

const baseUrl = require('../baseUrl')

async function updateName(data, token) {
  try {
    const result = await fetch(baseUrl + `user/name`, {
      method: 'POST',
      headers: {
        'Authorization': token,
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

async function resetPassword(data, token) {
  try {
    const result = await fetch(baseUrl + `user/reset_password`, {
      method: 'POST',
      headers: {
        'Authorization': token,
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

async function getListOrganizations(data, token) {
  try {
    const result = await fetch(baseUrl + `user/organizations?limit=${data.limit}&token=${data.token}&version=${data.version}`, {
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

async function selectOrganization(data, token) {
  try {
    const result = await fetch(baseUrl + `user/select-organization?oid=${data.oid}&version=${data.version}`, {
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

module.exports = { updateName, resetPassword, getListOrganizations, selectOrganization }
