import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("register user");
  return res.status(201).json({ message: "ok" });
});

export { registerUser };
