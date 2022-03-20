import express from "express";

import {getPostsBySearch,getPosts,getPost,createPost,updatePost,deletePost,likePost,donateProject} from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";


router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/',auth, createPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id',auth, deletePost);
router.patch('/:id/likePost',auth, likePost);
router.patch('/:id/donateProject',auth, donateProject);
router.patch('/:id/Summary',auth, getPosts);



export default router