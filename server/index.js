import express from 'express';
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validation.js";
import {checkAuth,handleValidationErrors} from "./utils/index.js";
import {PostController,UserController,TagController} from "../server/controllers/index.js";
import multer from "multer";
import cors from "cors";
import {getsortedtags} from "./controllers/TagController.js";
import {getPostsByTag} from "./controllers/PostController.js";

mongoose
    .connect("mongodb+srv://Denis:den0677164955@cluster0.hrzwzk9.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => console.log("DB ok"))
    .catch((err) => console.log('DB error', err));

const app = express();


const storage = multer.diskStorage({
    destination: (_,__,cb) =>{
        cb(null,'uploads');
    },
    filename:(_,file,cb) => {
        cb(null,file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'))

app.get('/',(req,res) => {
   res.send('H World!');
});

app.post('/auth/login',loginValidation,handleValidationErrors,UserController.login);
app.post('/auth/register',registerValidation,handleValidationErrors,UserController.register);
app.get('/auth/me',checkAuth,UserController.getMe);
app.patch('/updateuser/:id',handleValidationErrors,UserController.updateUser);
app.get('/user/:id',UserController.getMeById);

app.post('/upload',checkAuth,upload.single('image'),(req,res) => {
    res.json({
        url:`http://localhost:4444/uploads/${req.file.originalname}`
    })
});

app.get('/posts',PostController.getAll);
app.get('/posts/:id',PostController.getOne);
app.get('/postwithoutview/:id',checkAuth,PostController.getOneWithOutView);
app.get('/userposts/:id',PostController.getUserPosts);
app.get('/getuserviews/:id',PostController.getUserViews);
app.get('/getsortedtags/',TagController.getsortedtags);
app.get('/getPostsByTag/:tag',PostController.getPostsByTag);
app.post('/posts/create',checkAuth,postCreateValidation,handleValidationErrors,PostController.create);
app.delete('/postdelete/:id',checkAuth,PostController.remove);
app.patch('/postupdate/:id',checkAuth,postCreateValidation,handleValidationErrors,PostController.update);

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    }
    console.log('Server OK');
})