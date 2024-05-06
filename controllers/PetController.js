import { petModel } from "../models/petModel";
import { userModel } from "../models/UserModel";

getAllPet = async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "CUSTOMER") {
    res.status(401);
    throw new Error("Unauthorized user");
  }

  res.status(200);
  res.json(pets);
};

const getPetsByUserId = async (req, res) => {
  const pets = await petModel.find({ user: req.user.id });
  res.status(200);
  res.json(pets);
};

const getAPet = async (req, res) => {
  const pet = await petModel.findById(req.params.id);
  if (!pet) {
    res.status(400);
    throw new Error("Pet not found");
  }

  const user = await userModel.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (pet.user.toString() !== user.id) {
    res.status(401);
    throw new Error("Unauthorized user");
  }

  res.status(200);
  res.json(pet);
};

const createPet = async (req, res) => {
  const { name, quantity, categories, gender, price, image } = req.body;
  if (!name || !quantity || !categories || !gender || !price || !image) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const newPet = await petModel.create({
    name: name,
    quantity: quantity,
    categories: categories,
    gender: gender,
    price: price,
    image: image,
    user: req.user.id,
  });
  res.status(200);
  res.json(newPet);
};

const updatePet = async (req, res) => {
  const pet = await petModel.findById(req.params.id);
  if (!pet) {
    res.status(400);
    throw new Error("Pet not found");
  }

  const user = await userModel.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (pet.user.toString() !== user.id) {
    res.status(401);
    throw new Error("Unauthorized user");
  }

  const updatedPet = await petModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      quantity: req.body.quantity,
      categories: req.body.categories,
      gender: req.body.gender,
      price: req.body.price,
      image: req.body.image,
    },
    { new: true }
  );
  res.status(200);
  res.json(updatedPet);
};

const deletePet = async (req, res) => {
  const pet = await petModel.findById(req.params.id);
  if (!pet) {
    res.status(400);
    throw new Error("Pet not found");
  }

  const user = await userModel.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (pet.user.toString() !== user.id) {
    res.status(400);
    throw new Error("Unauthorized user");
  }

  await pet.remove();
  res.status(200);
  res.json(req.params.id);
};

module.exports = {
  getAPet,
  getPetsByUserId,
  createPet,
  updatePet,
  deletePet,
};
