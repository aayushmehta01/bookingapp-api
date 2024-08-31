import User from '../models/user.model.js'

export const updateUser = async(req, res, next) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true}
        );
        res.status(200).json(updatedUser);
    }catch(error){
        next(error);
    }
}

export const deleteUser = async(req, res, next) => {
    try{
        await User.findByIdAndDelete(
            req.params.id,
        );
        res.status(200).send("User has been deleted");
    }catch(error){
        next(error);
    }
}

export const getUser = async(req, res, next) => {
    try{
        const getUser = await User.findById(
            req.params.id,
        );
        res.status(200).json(getUser);
    }catch(error){
        next(error);
    }
}

export const getAllUser = async(req, res, next) => {
    try{
        const Users = await User.find();
        res.status(200).json(Users);
    }catch(error){
        next(error);
    }
}