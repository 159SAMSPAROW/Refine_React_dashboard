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

/* getAllProperties  permet de récupérer une liste de propriétés en fonction des critères de recherche spécifiés dans les paramètres de requête
 de l'URL. Elle gère également la pagination et le tri des résultats, et fournit des en-têtes HTTP pour permettre une utilisation appropriée de l'API.*/

const getAllProperties = async (req, res) => {

//Extrait les propriétés suivantes de l'objet req.query (qui contient les paramètres de requête de l'URL)
//Si une valeur n'est pas présente dans les paramètres de requête, la variable locale correspondante sera initialisée à une chaîne vide
  const { _end, _order, _start, _sort, title_like = '', propertyType = ''} = req.query 

  const query = {}

  if(propertyType !== '') {
    query.propertyType = propertyType
  }
  if(title_like) {
    query.title = { $regex: title_like, $option: 'i'}
  }
  try {
    const count = await Property.countDocuments({ query })
    const properties = await Property
    .find(query)
    .limit(_end)
    .skip(_start)
    .sort({ [_sort]: _order})

/*  Configuration des en-têtes HTTP de la réponse pour inclure le nombre total de propriétés dans l'en-tête x-total-count */
    res.header('x-total-count', count)
    res.header('Access-Control-Expose-Headers', 'x-total-count')
    res.status(200).json(properties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPropertyDetail = async (req, res) => {}

const createProperty = async (req, res) => {
    try {
      const {
        title, description, propertyType, location, price, photo, email,
      } = req.body;
  
      // Démarer une nouvelle session
      const session = await mongoose.startSession();
      session.startTransaction();
  
      // Trouver un user par son email
      const user = await User.findOne({ email }).session(session);
      if (!user) {
        throw new Error('User not found');
      }
  
      const photoUrl = await cloudinary.uploader.upload(photo);
  
      // Créer une nouvelle propriété
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
  
      // Mettre à jour le champ allProperties de l'utilisateur avec la nouvelle propriété
      user.allProperties.push(newProperty._id);
      await user.save({ session });
  
      // Valider la transaction
      await session.commitTransaction();
  
      // Envoyer la réponse
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
