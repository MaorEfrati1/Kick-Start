import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMeassage.js'
import UserModal from "../models/user.js";

const router = express.Router();


export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ expirationDate: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
};


export const getPostsBySearch = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post,creator: req.userId,createdAt: new Date().toISOString() })

    try {
        await newPost.save();
        
        res.status(201).json(newPost );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


export const updatePost = async (req, res) => {
    const {id: _id} = req.params
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
    return res.status(202).send('(UPDATE) No Post With That ID');

   const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id}, {new: true});

   res.json(updatedPost);
}


export const deletePost = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
    return res.status(202).send('(DELETE) No Post With That ID');

    await PostMessage.findByIdAndRemove(id);

   res.json({ message : 'Post Deleted Succsessfully'});
}



// export const donateProject = async (req, res) => {
//     const {id} = req.params
//     // const {donate} = req.params

//   if (!req.userId) {
//         return res.json({ message: "Unauthenticated" });
//       }

//     if(!mongoose.Types.ObjectId.isValid(id))
//     return res.status(202).send('No Post With That ID');

//     const post = await PostMessage.findById(id);
    
// //     const index = post.donor.findIndex((id) => id ===String(req.userId));

// //   if (index === -1) {
// //       post.donor.push(req.userId);
// //     } else {
// //       post.donor = post.donor.filter((id) => id !== String(req.userId));
// //     }
// // console.log(post.donor)
//         post.donates= post.donates + 3
//     const updatedPost = await PostMessage.findByIdAndUpdate(id, post , {new: true} );
//     res.status(205).json(updatedPost);
// }

export const likePost = async (req, res) => {
    const {id} = req.params

  if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }


    if(!mongoose.Types.ObjectId.isValid(id))
    return res.status(202).send('No Post With That ID');

    const post = await PostMessage.findById(id);
    
    const index = post.likes.findIndex((id) => id ===String(req.userId));

       if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true} );

   res.json(updatedPost);
}

export const donateProject = async (req, res) => {
    const {id} = req.params
    const {userName} = req.params

    const userId=req.userId
    const oldUser = await UserModal.findOne({_id: userId });

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if(!mongoose.Types.ObjectId.isValid(id))
    return res.status(202).send('No Post With That ID');

    const post = await PostMessage.findById(id);
    
    const index = post.donor.findIndex((id) => id === String(oldUser.name));

       if (index === -1) {
      post.donor.push(oldUser.name);
    } else {
    //   post.donor = post.donor.filter((id) => id !== String(post.name));
    }
    post.donates=post.donates+100;
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true} );

   res.json(updatedPost);
}


export default router;

