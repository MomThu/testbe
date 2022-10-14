var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const { updateName, resetPassword, getListOrganizations, selectOrganization } = require('../api/user.api');

router.use(bodyParser.json());

router.post('/name', async (req, res, next) => {
  const data = req.body;
  const token = req.session.token;
  try {
    const [result, status] = await updateName(data, token)
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/resetPassword', async (req, res, next) => {
  const data = req.body;
  const token = req.session.token;
  try {
    const [result, status] = await resetPassword(data, token)
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/organizations', async (req, res, next) => {
  var input = req.body;
  const data = {
    limit: input.limit,
    token: input.token,
    version: input.version,
  }
  const token = req.session.token
  try {
    const [result, status] = await getListOrganizations(data, token)
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/selectOrganization', async (req, res, next) => {
  var input = req.body;
  const data = {
    oid: input.oid,
    version: input.version,
  }
  const token = req.session.token
  try {
    const [result, status] = await selectOrganization(data, token)
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

module.exports = router