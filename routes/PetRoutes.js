import express from "express";
import { Protected } from "../middleware/AuthMiddleware.js";
import {
  createPet,
  deletePet,
  getAllPets,
  getPetById,
  getPetsByUserId,
  updatePet,
} from "../controllers/PetController.js";

const petRouter = express.Router();

petRouter.route("/").get(getAllPets).post(Protected, createPet);
petRouter.route("/user").get(Protected, getPetsByUserId);
petRouter
  .route("/:id")
  .put(Protected, updatePet)
  .delete(Protected, deletePet)
  .get(getPetById);

export default petRouter;
