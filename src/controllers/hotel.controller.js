import Hotel from '../models/hotel.model.js'
import Room from '../models/room.model.js'

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

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(
            cities.map((city) => {
            return Hotel.countDocuments({ city: city });
            })
        );
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cottageCount = await Hotel.countDocuments({ type: "cottage" });

        res.status(200).json([
        { type: "hotel", count: hotelCount },
        { type: "apartment", count: apartmentCount },
        { type: "resort", count: resortCount },
        { type: "villa", count: villaCount },
        { type: "cottage", count: cottageCount },
        ]);
    } catch (err) {
        next(err);
    }
};

export const getAllHotel = async(req, res, next) => {
    const { min, max, ...others } = req.query;
    try{
        const Hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gt: min || 0, $lt: max || 100000000 },
          }).limit(req.query.limit);
        res.status(200).json(Hotels);
    }catch(error){
        next(error);
    }
}

export const getHotelRooms = async(req, res, next) => {
    console.log('Incoming request to getHotelRooms:', req.params); 
    try{
        const hotel = await Hotel.findById(req.params.id)
        console.log("Hotel found: ", hotel);
        
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const list = await Promise.all(
            hotel.rooms.map((room)=>{
                return Room.findById(room);
            })
        )        
        console.log('Request Params:', req.params);
        console.log('Returning Rooms:', list);
        res.status(200).json(list);
    }catch(err){
        next(err);
    }
}