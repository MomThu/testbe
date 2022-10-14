var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const { register, login, requestOtp, verifyToken, getSharingCode, verifyOtp } = require('../api/sso.api')
const { getCaptcha } = require('../api/captcha.api');

router.use(bodyParser.json());

router.post('/register', async (req, res, next) => {
  const data = req.body;
  const version = '1.0.0';
  try {
    const [result, status] = await register(data, version)
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/captcha', async (req, res, next) => {
  try {
    const [result, status] = await getCaptcha()
    res.statusCode = status
    res.json(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/login', async (req, res, next) => {
  if (!req.session.user) {
    var input = req.body;
    if (!input) {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }

    const data = {
      username: input.username,
      password: input.password,
      captcha: input.captcha,
      source: input.source
    }

    const [response, status] = await login(data)
    if (status === 200) {
      req.session.user = 'authenticated';
      console.log(response)
      req.session.token = response.data.token;
      req.session.username = response.data.data.username;
      req.session.source = response.data.data.source;

      const [result, status] = await getSharingCode(req.session.token)
      if (status === 200) {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: 'You are authenticated!', sharingCode: result.data })
      } else {
        var err = new Error(response.message);
        err.status = status;
        return next(err);
      }
    } else {
      var err = new Error(response.message);
      err.status = status;
      return next(err);
    }
  } else {
    const verifyData = {
      token: req.session.token,
      username: req.session.username,
      source: req.session.source,
      version: '1.0.0'
    }
    const token = req.session.token
    const [result, status] = await verifyToken(verifyData, token)
    console.log(result, status)
    if (status === 200) {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'You are already authenticated!' });
    } else {
      // await req.session.destroy();
      // res.clearCookie('sessionId');
      // res.json({ message: 'logout successfully!' });
      var err = new Error(result.message);
      err.status = status;
      return next(err);
    }
  }
})

router.post('/loginOTP', async (req, res, next) => {
  if (!req.session.user) {
    var input = req.body;
    if (!input) {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }

    const data = {
      phone: input.phone,
      source: input.source,
      captcha: input.captcha
    }

    const [response, status] = await requestOtp(data)
    if (status === 200) {
      res.statusCode = status;
      res.json({ message: response.message })
    } else {
      var err = new Error(response.message);
      err.status = status;
      return next(err);
    }
  } else {
    const verifyData = {
      token: req.session.token,
      username: req.session.username,
      source: req.session.source,
      version: '1.0.0'
    }
    const [result, status] = await verifyToken(verifyData)
    if (status === 200) {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'You are already authenticated!' });
    } else {
      // await req.session.destroy();
      // res.clearCookie('sessionId');
      // res.json({ message: 'logout successfully!' });
      var err = new Error(result.message);
      err.status = status;
      return next(err);
    }
  }
})

router.post('/verifyOTP', async (req, res, next) => {
  var input = req.body;
  if (!input) {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  }

  const data = {
    phone: input.phone,
    source: input.source,
    otp: input.otp
  }
  const [response, status] = await verifyOtp(data)
  if (status === 200) {
    req.session.user = 'authenticated';
    req.session.token = response.data.token;
    req.session.username = response.data.data.username; // username/phone
    req.session.source = response.data.data.source;
    res.statusCode = status;
    res.json({ message: response.message })
  } else {
    var err = new Error(response.message);
    err.status = status;
    return next(err);
  }
})

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    await req.session.destroy();
    res.clearCookie('sessionId');
    res.json({ message: 'logout successfully!' });
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
});
module.exports = router;
