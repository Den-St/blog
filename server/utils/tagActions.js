import TagModel from "../models/Tag.js";
import Tag from "../models/Tag.js";

export const saveTag = async (tag) =>{
    const docT = new TagModel({
        tag:tag,
    });
    await docT.save();
}

export const increaseCount = (tag) =>{
    TagModel.findOneAndUpdate(
        {
            tag:tag,
        },
        {
            $inc: {count:1}
        },
        {
            returnDocument:'after',
        },
        async (err,doc)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    message:'Не удалось 1найтjи tag'
                });
            }
            if(!doc){
                try{saveTag(tag);}
                catch(err){return res.status(404).json({
                    message:'Не удалось 2найти tag'
                });}
                return;
            }
            await doc.save();
        }
    );
}

export const decreaseTagCount = async (tag) =>{
    const id = tag._id;

    TagModel.findOneAndUpdate({
        _id:id
        },
        {
            $inc: {count:-1}
        },
        {
            returnDocument:'after',
        },
        async (err,doc)=>{
            if(err){
                console.log(err);
            }
            await doc.save();
        }
    );
}
export const deleteTag = async (tag) =>{
    const id = tag._id;
    TagModel.findByIdAndDelete(
        {
            _id:id
        },(err,doc)=>{
            if(err){
                console.log(err);
            }
            if(!doc){
                console.log("doc: ",doc);
            }
        }
    );
}