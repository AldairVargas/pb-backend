import express from "express";
import { getUsers, getUserById, createUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);

export default router;