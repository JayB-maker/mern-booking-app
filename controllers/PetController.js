import { petModel } from "../models/petModel.js";

export const getAllPets = async (req, res) => {
  try {
    const pets = await petModel.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error retrieving pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPetsByUserId = async (req, res) => {
  try {
    const pets = await petModel.find({ user: req.user.id });
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error retrieving user's pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await petModel.findById(req.params.id);
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error retrieving pet by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPet = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "ADMIN") {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }
    const { name, quantity, categories, gender, price, image } = req.body;
    if (!name || !quantity || !categories || !gender || !price || !image) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const newPet = await petModel.create({
      name,
      quantity,
      categories,
      gender,
      price,
      image,
      user: req.user.id,
    });
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await petModel.findById(req.params.id);
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    if (pet.user.toString() !== req.user.id) {
      res.status(401).json({ error: "Unauthorized user" });
      return;
    }
    const updatedPet = await petModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await petModel.findById(req.params.id);
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    if (pet.user.toString() !== req.user.id) {
      res.status(401).json({ error: "Unauthorized user" });
      return;
    }
    await pet.remove();
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCustomerAccessiblePets = async (req, res) => {
  try {
    const pets = await petModel.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error retrieving customer accessible pets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
