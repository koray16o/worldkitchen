const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (username === '' || email === '' || password === '') {
    res.render('auth/signup', { errorMessage: 'Fill in all the fields' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (regex.test(password) === false) {
    res.render('auth/signup', { errorMessage: 'Password is too weak' });
    return;
  }

  const user = await User.findOne({ username });
  if (user !== null) {
    res.render('auth/signup', { errorMessage: 'Username already exists' });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', { errorMessage: 'Invalid Login' });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.render('auth/login', { errorMessage: 'Invalid Login' });
    return;
  }

  //checking for password
  if (bcrypt.compareSync(password, user.password)) {
    //Passwords match
    req.session.currentUser = user;
    res.redirect('/');
  } else {
    //Passwords dont match
    res.render('auth/login', { errorMessage: 'Invalid Login' });
    return;
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
