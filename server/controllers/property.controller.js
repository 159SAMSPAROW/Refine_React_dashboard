import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

import mongoose from 'mongoose'
import Property from '../mongoDB/models/property.js'
import User from '../mongoDB/models/user.js'



dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getAllProperties = async (req, res) => {}

const getPropertyDetail = async (req, res) => {}

const createProperty = async (req, res) => {
    try {
      const {
        title, description, propertyType, location, price, photo, email,
      } = req.body;
  
      // Start a new session
      const session = await mongoose.startSession();
      session.startTransaction();
  
      // Retrieve user by email
      const user = await User.findOne({ email }).session(session);
      if (!user) {
        throw new Error('User not found');
      }
  
      const photoUrl = await cloudinary.uploader.upload(photo);
  
      // Create a new property
      const newProperty = await Property.create(
        {
          title,
          description,
          propertyType,
          location,
          price,
          photo: photoUrl.url,
          creator: user._id,
        },
      );
  
      // Update the user's allProperties field with the new property
      user.allProperties.push(newProperty._id);
      await user.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
  
      // Send response
      res.status(200).json({ message: 'Property created successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create property, please try again later' });
    }
  };

const updateProperty = async (req, res) => {}

const deleteProperty = async (req, res) => {}

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
}
