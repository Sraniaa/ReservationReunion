import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Controller to create an admin account
export const createAdminAccount = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check if the email is already in use
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next(new ErrorHandler("This email is already in use!", 400));
  }

  // Create the admin account with a default role of 'admin'
  await User.create({
    name,
    email,
    phone,
    password,
    role: 'admin',
  });

  // Send back a response without a JWT token
  res.status(201).json({
    success: true,
    message: "Admin account created successfully!"
  });
});


// Controller to fetch all users with role 'user'
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({ role: 'user' });
  res.status(200).json({
    success: true,
    users,
  });
});

// Controller to update a user's details
export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;

  const user = await User.findOneAndUpdate({ _id: id, role: 'user' }, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found or unauthorized modification.", 404));
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    user,
  });
});

// Controller to delete a user
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOneAndDelete({ _id: id, role: 'user' });

  if (!user) {
    return next(new ErrorHandler("User not found or unauthorized deletion.", 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

// Controller to fetch all admins
export const getAllAdmins = catchAsyncError(async (req, res, next) => {
  // Fetch users with roles either 'admin' or 'superadmin'
  const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });
  res.status(200).json({
    success: true,
    admins,
  });
});


// Controller to update an admin's details
export const updateAdmin = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const adminData = req.body;

  // Ensure that superadmins cannot be updated through this endpoint
  if (adminData.role && adminData.role === 'superadmin') {
    return next(new ErrorHandler("Unauthorized to change superadmin role.", 403));
  }

  const admin = await User.findOneAndUpdate({ _id: id, role: 'admin' }, adminData, {
    new: true,
    runValidators: true,
  });

  if (!admin) {
    return next(new ErrorHandler("Admin not found or unauthorized modification.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Admin updated successfully.",
    admin,
  });
});

// Controller to delete an admin
export const deleteAdmin = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the user without deleting to check their role
  const user = await User.findById(id);

  // If user is not found or has a role of 'superadmin', do not proceed with deletion
  if (!user || user.role === 'superadmin') {
    return next(new ErrorHandler("Admin not found, or deletion of superadmin is unauthorized.", 403));
  }

  // If user is an admin, proceed with deletion
  await User.findOneAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Admin deleted successfully.",
  });
});
