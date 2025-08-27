const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    
    if (!userId || !newRole) {
      return res.status(400).json({
        success: false,
        message: "User ID and new role are required",
      });
    }
    
    // Only allow valid roles
    if (!['student', 'instructor', 'admin'].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles are: student, instructor, admin",
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    user.role = newRole;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: `User role updated to ${newRole} successfully`,
      data: {
        _id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    
    // Search by username or email with case-insensitive matching
    const users = await User.find({
      $or: [
        { userName: { $regex: q, $options: 'i' } },
        { userEmail: { $regex: q, $options: 'i' } }
      ]
    }).select('_id userName userEmail role'); // Only return necessary fields
    
    return res.status(200).json({
      success: true,
      message: `Found ${users.length} users`,
      data: users
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, updateUserRole, searchUsers };
