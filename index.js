const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors());
const db = require('./models')

const postRouter = require('./routes/Posts')
app.use("/posts", postRouter)

const commentsRouter = require('./routes/Comments')
app.use("/comments", commentsRouter)

const usersRouter = require('./routes/Users')
app.use("/auth", usersRouter)

const likesRouter = require('./routes/Likes')
app.use("/likes", likesRouter)

db.sequelize.sync({ alter: true }).then(() => { 

    const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
});
  
})


