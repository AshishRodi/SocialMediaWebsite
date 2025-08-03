const express = require('express')
const router = express.Router()
const {Users} = require('../models')
const bcrypt = require('bcrypt')
const { where } = require('sequelize')
const {sign} = require('jsonwebtoken')
const { validateToken } = require('../middlewares/AuthMiddleware')
router.post("/", async (req, res)=>{
    const {username, password} = req.body
    bcrypt.hash(password, 10).then((hash) =>{
        Users.create({
            username: username,
            password: hash
        })
        res.json("Success") 
    }) // level of scrambling to protect password
})


router.post("/login", async(req, res) =>{
    const {username, password} = req.body
    try {
        const user = await Users.findOne({ where: { username } });
    
        
        if (!user) {
          return res.status(404).json({ error: "User doesn't exist" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: "Wrong username and password combination" });
        }
        const accessToken = sign({username: user.username, id: user.id}, "importantsecret");
        res.json({token: accessToken, username: username, id: user.id});
    
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
})

router.get('/auth', validateToken, (req, res) =>{
  res.json(req.user);
})

router.get('/basicinfo/:id', async(req, res)=>{
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, 
    {attributes: {exclude: ['password']}});
    res.json(basicInfo)

});
router.put('/changepassword', validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findOne({ where: { username: req.user.username } });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hash }, { where: { username: req.user.username } });

    res.json("Success");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Something went wrong while updating the password." });
  }
});

module.exports = router
