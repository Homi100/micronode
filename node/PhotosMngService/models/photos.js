import mongoose from 'mongoose';

const photosSchema = new mongoose.Schema({
    photoName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    photoSize: { type: Number, required: true },
    userId: { type: String, required: true },
  });

const Photos = mongoose.model("Photos", photosSchema);
export default Photos;