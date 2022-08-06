import PostModel from "../models/Post.js";
import {increaseCount} from "../utils/tagActions.js";
import {removeTag, updateTag} from "./TagController.js";

export const getAll = async (req,res) => {
    try{
        const posts = await PostModel.find();
        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось вывести все посты"
        });
    }
};

export const getOne = async (req,res) => {
    try{
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id:postId,
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument:'after',
            },
            (err,doc)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({
                            message:'Не удалось 1найти статью'
                    });
                }
                if(!doc){
                    return res.status(404).json({
                        message:'Не удалось 2найти статью'
                    });
                }
                res.json(doc);
            }
        );
    }catch (err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось 3найти статью"
        });
    }
};
export const getOneWithOutView = async (req,res) =>{
    try{
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        res.json({post:post});
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось найти статью"
        })
    }
}
export const remove = async (req,res) => {
    try{
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        removeTag(post.tags);
        PostModel.findOneAndDelete(
            {
                _id:postId,
            },
            (err,doc)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        message:'Не удалось удалить статью'
                    });
                }
                if(!doc){
                    console.log("doc: ",doc);
                    return res.status(404).json({
                        message:'Статья не найдена'
                    });
                }
                res.json({
                    success:true,
                });
            }
        );
    }catch (err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось удалить статью"
        });
    }
};

export const create = async (req,res) => {
    try{
        const docP = new PostModel({
            title: req.body.title,
            textContent: req.body.textContent,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });
        const post = await docP.save();

        if(!!req.body.tags.length){
            const setTags = new Set(req.body.tags);

            [...setTags].map(tag => {
                increaseCount(tag);
            })
        }
        res.json(post);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось создать пост"
        });
    }
}

export const update = async (req,res) =>{
    try{
        const postId =  req.params.id;
        const prevPost = await PostModel.findById(postId);
        removeTag(prevPost.tags);
        updateTag(req.body.tags);
        await PostModel.updateOne({
            _id:postId
        },
{
        title: req.body.title,
        textContent: req.body.textContent,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        })
        res.json({
            success:true,
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Не удалось обновить статью"
        });
    }
}

export const getUserPosts = async (req,res) =>{
    try{
        const posts = await PostModel.find({user:req.params.id});
        res.json({posts:posts});
    }catch(err){
        res.status(500)({
            message:"Не удалось найти посты этого пользователя"
        })
    }
}

export const getUserViews = async (req,res) =>{
    try{
        const posts = await PostModel.find({user:req.params.id});
        let views = 0;
        posts.map(post => views+=post.viewsCount);
        res.json({
            numberOfViews:views,
        })
    }catch(err){}
}

export const getPostsByTag = async (req,res) =>{
    try{
        const tag = req.params.tag;
        const posts = await PostModel.find();
        const postsById = posts.filter(post => post.tags.includes(tag));
        res.json(postsById);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Ошибка",
        })
    }
}