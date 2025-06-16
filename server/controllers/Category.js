const Category = require("../models/Category")
const Course=require("../models/Course")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const mongoose = require("mongoose")


exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    console.log("🟡 Received request for categoryPageDetails with categoryId:", categoryId);

    // Check if categoryId is provided
    if (!categoryId) {
      console.error("❌ categoryId is missing in the request body.");
      return res.status(400).json({
        success: false,
        message: "categoryId is required.",
      });
    }

    const cat = await Category.findById(categoryId);
console.log("kjj:",cat.courses); // Should print an array of ObjectIds


    // Fetch the selected category and its published courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    console.log("selected category :", selectedCategory);

    if (!selectedCategory) {
      console.warn("❌ Category not found for ID:", categoryId);
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const selectedCourses = await Course.find({
      category: categoryId,
      status: "Published",
    })
      .populate("ratingAndReviews")
      .exec();

    if (selectedCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found for this category.",
      });
    }

    const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });

   let differentCourses = [];

if (categoriesExceptSelected.length > 0) {
  // Pick any other category (random or first one)
  const randomDifferentCategory = categoriesExceptSelected[Math.floor(Math.random() * categoriesExceptSelected.length)];

  console.log("🟢 Random different category chosen:", randomDifferentCategory._id);

  // Get all courses from that different category
  differentCourses = await Course.find({
    category: randomDifferentCategory._id,
    status: "Published",
  })
    .populate("ratingAndReviews")
    .exec();

  console.log("🟢 differentCourses found:", differentCourses.length);
}


    const mostSellingCourses = await Course.find({ status: "Published" })
      .sort({ "studentsEnroled.length": -1 })
      .populate("ratingAndReviews")
      .exec();

    return res.status(200).json({
      success: true,
      selectedCourses,
      differentCourses,
      mostSellingCourses,
      name: selectedCategory.name,
      description: selectedCategory.description,
    });

  } catch (error) {
    console.error("categoryPageDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }



   

};

// Utility function (ensure it's defined somewhere in your code)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

