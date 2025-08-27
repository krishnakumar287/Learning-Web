const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserRole,
  searchUsers
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const verifyRole = require("../../middleware/role-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

// Route to update user role - restricted to instructor and admin roles
router.post("/update-role", authenticateMiddleware, verifyRole(["instructor", "admin"]), updateUserRole);

// Route to search users - restricted to instructor and admin roles
router.get("/search-users", authenticateMiddleware, verifyRole(["instructor", "admin"]), searchUsers);

module.exports = router;
