import TagModel from "../models/Tag.js";
import {decreaseTagCount, deleteTag, increaseCount} from "../utils/tagActions.js";

export const getsortedtags = async (req,res) =>{
    try{
    res.json({
        sortedTags:await TagModel.find().sort('-count').limit(5),
    })
    }catch(err){
        console.log(err);
        res.json({
            message:"Не удалось отсортировать теги",
        })
    }
}

export const removeTag = async (tags) =>{
    try{
        if(!!tags.length){
            const setTags = new Set(tags);
            [...setTags].map(async (tag) => {
                const tagObject = await TagModel.find({tag:tag});
                const count = tagObject[0].count;
                console.log("tagobject",tagObject);
                console.log("tag",tag)
                count > 1 ? decreaseTagCount(tagObject[0]) : deleteTag(tagObject[0]);
            })
        }
    }catch(err){
        console.log("xxxxxxxxxxxxxxxxxxxxx")
    }
}

export const updateTag = async (tags) =>{
    try{
        if(!!tags.length){
            const setTags = new Set(tags);

            [...setTags].map(tag => {
                increaseCount(tag);
            })
        }
    }catch(err){
        console.log("gavno")
    }
}