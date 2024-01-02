import { v2 as cloudinary } from "cloudinary";

import { Router } from "express";
import multer from "multer";
import axios from "axios";
import Photos from "../models/photos.js";

const router = Router();

const LOGGING_API_URL = 'http://loggingservice-srv:8004/log';

// Helper function to send log events to the logging API
const logToApi = async (event, message) => {
  try {
    await axios.post(LOGGING_API_URL, { event, message });
  } catch (error) {
    console.error('Error logging to API:', error.message);
  }
};

// Multer middleware for handling file uploads
const upload = multer({
    limits: { fileSize: 10485760 }, // File size limit (10MB)
  }).single("image");

//cloudinary configuration
cloudinary.config({
    cloud_name: "deragsdak",
    api_key: "487494414134748",
    api_secret: "uK9ai6Q4tSpvoz_uYSaYmrYpjxQ",
  })
// ImageUpload endpoint
router.post("/upload", upload, async (req, res) => {
  console.log(req.file);
  //nothing to upload
    if (!req.file) {
      await logToApi('Image upload failed', 'No file uploaded');
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    //sending http request to storage service
    const totalSize = req.file.size;
    const user = req.body.userId;
    // Update user's storage
  let userStorage;
  //getting user storage
    userStorage = await axios.get(
      `${process.env.STORAGE_SERVICE_URL}/api/storage/user/${user}`
    );
  //storage is 0
    if (!userStorage.data.data) {
      userStorage = await axios.post(
        `${process.env.STORAGE_SERVICE_URL}/api/storage/`,
        { totalStorage: 0, user }
      );
    }
  //otherwise
    if (
      userStorage.data.data.totalStorage + totalSize >
      process.env.STORAGE_LIMIT
    ) {
      return res
        .status(500)
        .json({
          status: false,
          msg: "Limit Exeeded. Total storage limit is 10MB",
        });
    }
  
    // update user's daily usage
    let userDailyUsage;
    userDailyUsage = await axios.get(
      `${process.env.USAGE_SERVICE_URL}/api/usage/user/${user}`
    );
    if (!userDailyUsage.data.data) {
      userDailyUsage = await axios.post(
        `${process.env.USAGE_SERVICE_URL}/api/usage/`,
        { totalUsage: 0, user }
      );
    }
    if (
      userDailyUsage.data.data.totalUsage + totalSize >
      process.env.DAILY_USAGE_LIMIT
    ) {
      return res
        .status(500)
        .json({ status: false, msg: "Limit Exeeded. Daily usage limit is 25MB" });
    }
  
    //sending updating requestes
    const newTotalStorage = userStorage.data.data.totalStorage + totalSize;
    await axios.put(
      `${process.env.STORAGE_SERVICE_URL}/api/storage/user/${user}`,
      { totalStorage: newTotalStorage }
    );
  
    const newTotalUsage = userDailyUsage.data.data.totalUsage + totalSize;
    await axios.put(`${process.env.USAGE_SERVICE_URL}/api/usage/user/${user}`, {
      totalUsage: newTotalUsage,
    });
  
    const b64 = req.file.buffer.toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  
    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "RAAFZ",
      });
  
      // Save image URL and public ID in the database
      const newImage = new Photos({
        photoName: req.file.originalname,
        photoSize: req.file.size,
        url: result.url,
        publicId: result.public_id,
        userId: req.body.userId,
      });
  
      await newImage.save();

      res.json({ file: newImage, message: "Image uploaded successfully" });
      await logToApi('Image upload successful', `Image uploaded successfully for user ID ${req.body.userId}`);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  // GetAllImages endpoint
router.get("/", async (req, res) => {
    try {
      // Retrieve all images from the database
      const images = await Photos.find();
      await logToApi('Retrieve all images', 'All images retrieved successfully');
      res.json(images);
    } catch (error) {
      console.error("Error retrieving images:", error);
      await logToApi('Retrieve all images failed', 'Internal Server Error');
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
router.get("/user/:userId", async (req, res) => {
    try {
      // Retrieve userId from request parameters
      const userId = req.params.userId;
  
      // Retrieve images based on userId from the database
      const images = await Photos.find({ userId });
      await logToApi('Retrieve images by user ID', `Images retrieved successfully for user ID ${userId}`);
      res.json(images);
    } catch (error) {
      console.error("Error retrieving images:", error);
      await logToApi('Retrieve images by user ID failed', 'Internal Server Error');
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  // DeleteImage endpoint
router.delete("/:id", async (req, res) => {
    const imageId = req.params.id;
  
    try {
      // Find the image by ID
      const image = await Photos.findById(imageId);
        
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
  
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(image.publicId);
  
      // Delete the image from the database
      await Photos.findByIdAndDelete(imageId);
  
      // Update user's storage
      const userStorage = await axios.get(
        `${process.env.STORAGE_SERVICE_URL}/api/storage/user/${image.userId}`
      );
      const totalSize = image.photoSize;
      console.log(totalSize);
      console.log("image", image);
      const newTotalStorage = userStorage.data.data.totalStorage - totalSize;
      await axios.put(
        `${process.env.STORAGE_SERVICE_URL}/api/storage/user/${image.userId}`,
        { totalStorage: newTotalStorage }
      );
      await logToApi('Image deletion successful', `Image deleted successfully for user ID ${image.userId}`);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      await logToApi('Image deletion failed', 'Internal Server Error');
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

export default router;