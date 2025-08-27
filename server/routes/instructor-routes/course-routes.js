const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
} = require("../../controllers/instructor-controller/course-controller");
const authenticate = require("../../middleware/auth-middleware");
const verifyRole = require("../../middleware/role-middleware");
const router = express.Router();

// Apply authenticate middleware to all routes, then verify instructor role
router.post("/add", authenticate, verifyRole(["instructor"]), addNewCourse);
router.get("/get", authenticate, verifyRole(["instructor"]), getAllCourses);
router.get("/get/details/:id", authenticate, verifyRole(["instructor"]), getCourseDetailsByID);
router.put("/update/:id", authenticate, verifyRole(["instructor"]), updateCourseByID);

module.exports = router;
