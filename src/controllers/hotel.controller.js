import Hotel from '../models/hotel.model.js'

export const createHotel = async(req, res, next) => {
    const newHotel = new Hotel(req.body);

    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    }catch(error){
        next(error);
    }
}

export const updateHotel = async(req, res, next) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true}
        );
        res.status(200).json(updatedHotel);
    }catch(error){
        next(error);
    }
}

export const deleteHotel = async(req, res, next) => {
    try{
        await Hotel.findByIdAndDelete(
            req.params.id,
        );
        res.status(200).send("Hotel has been deleted");
    }catch(error){
        next(error);
    }
}

export const getHotel = async(req, res, next) => {
    try{
        const getHotel = await Hotel.findById(
            req.params.id,
        );
        res.status(200).json(getHotel);
    }catch(error){
        next(error);
    }
}

export const getAllHotel = async(req, res, next) => {
    try{
        const Hotels = await Hotel.find();
        res.status(200).json(Hotels);
    }catch(error){
        next(error);
    }
}