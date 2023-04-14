var express = require('express');
const authApi = express.Router();
const AuthCollection =  require('./schema')
const bodyParser = require('body-parser')

authApi.use(bodyParser.json());

const users = [
    {
      id: 1,
      username: 'user1',
      password: 'password1'
    },
    {
      id: 2,
      username: 'user2',
      password: 'password2'
    }
  ];

authApi.post('/login', (req, res) => {
    console.log('running', req.query);
    const {username, password} = req.body;
    const user = users.find((el) => el.username === username && el.password === password);
    if (user) {
      let userAuth = new AuthCollection({
        username, password
      })
      userAuth.save()
      res.send({message: 'Login Successful'});
    } else {
        res.status(401).send({message: 'Invalid Login'})
    }
})

module.exports = authApi
