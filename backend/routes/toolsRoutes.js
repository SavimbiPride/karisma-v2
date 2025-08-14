const express = require("express");
const router = express.Router();
const {getTools, getToolById, createTool, updateTool, deleteTool} = require("../controllers/toolsController");
const upload = require("../middleware/uploadsingle");

router.get('/list-tools', getTools);
router.get("/tools/:id", getToolById);
router.post('/tools', upload.single('image'), createTool);
router.put("/tools/:id", upload.single("image"), updateTool);
router.delete("/tools/:id", deleteTool);

module.exports = router;
