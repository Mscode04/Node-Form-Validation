const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt'); 

// router.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/login.html')); 
// });


router.get('/login', (req, res) => {
  res.render('login');  
});


router.get('/homee', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/hm.html')); 
});
router.get('/er', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/error.html')); 
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// WHEN SUBMIT DATA 
router.post('/up', async function (req, res) {
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);

  try {
    await client.connect(); 
    const db = client.db('dex'); 
    const users = await db.collection('user').find({}).toArray();

    var arremail = [];
    for (let i = 0; i < users.length; i++) {
      arremail.push(users[i].email); 
    }

    var char = ['@', '#', ','];
    if (!/[A-Z]/.test(req.body.pw) || !/[a-z]/.test(req.body.pw) || !char.some(symbol => req.body.pw.includes(symbol))) {
      return res.render('index', { title: 'Ms Form', errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, and one symbol (@, #, or ,)!' });
    }
    if (req.body.pw !== req.body.cpw) {
      return res.render('index', { title: 'Ms Form', errorMessage: 'Passwords do not match!' });
    }

    if (arremail.includes(req.body.email)) {
      console.log("Login");
      return res.redirect('/login'); 
    } 
   
    else {
      const hashedPassword = await bcrypt.hash(req.body.pw, 10);
      const userData = {
        first_name:req.body.first_name,
        last_name:req.body. last_name,
        email: req.body.email,
        pw: hashedPassword 
      };

      await db.collection('user').insertOne(userData);
      return res.redirect('/homee'); 
    }

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Failed to fetch users');
  } finally {
    await client.close(); 
  }
});

// WHEN SUBMIT DATA 
router.post('/sub', async function (req, res) {
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);

  try {
    await client.connect(); 
    const db = client.db('dex'); 
    const users = await db.collection('user').find({}).toArray();

   
    var arremail = [];
    for (let i = 0; i < users.length; i++) {
      arremail.push(users[i].email); 
    }

    let index = arremail.indexOf(req.body.email);
    if (index === -1) {
      return res.render('login',{ Message: 'Email Not Found' });; 
    }




    if (arremail.includes(req.body.email)) {
    }
    else{
      return res.render('login',{ Message: 'NOt Found User' });; 
    }





    const isMatch = await bcrypt.compare(req.body.pw, users[index].pw);

    if (isMatch) {
      return res.redirect('/homee'); 
      
    } else {
      return res.render('login',{ Message: 'Password Not Found' });; 
    }

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Failed to fetch users');
  } finally {
    await client.close(); 
  }
});

module.exports = router;
