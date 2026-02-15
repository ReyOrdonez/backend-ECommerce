import { getUsersService, createUserService, getUserByIdService, removeUserService, updateUserService, } from "../services/users.services.js";
//Zod schemas
import { createUserInput, userOutput, updateUserInput, } from "../Schemas/user.schemas.js";
//Get all users
const getAll = async (req, res, next) => {
    try {
        const users = await getUsersService();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
//Get user by id
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(Number(id));
        const result = userOutput.parse(user); //validate output with zod schema before sending response
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
//Create a new user
const create = async (req, res, next) => {
    try {
        const { username, email, password } = createUserInput.parse(req.body);
        const newUser = await createUserService({
            username,
            email,
            password,
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
};
//remove user by id
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await removeUserService(Number(id));
        const result = userOutput.parse(deletedUser); //validate output with zod schema before sending response
        return res.status(200).json(`User ${result} successfully deleted`);
    }
    catch (error) {
        next(error);
    }
};
//Update user by id
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateUserInput.parse(req.body);
        const updatedUser = await updateUserService(Number(id), data);
        const result = userOutput.parse(updatedUser); //validate output with zod schema before sending response
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
const usersController = { getAll, create, getById, remove, update };
export default usersController;
//# sourceMappingURL=users.controller.js.map