const express = require("express");
const router = express.Router();

// Sample data for DIY videos
const diyVideos = [
  { id: 1, title: "Change a Light Bulb", type: "youtube", url: "https://www.youtube.com/embed/GcsNu_9_Di8" },
  { id: 2, title: "How to Change a Tire", type: "youtube", url: "https://www.youtube.com/embed/joBmbh0AGSQ" },
  { id: 3, title: "Jumpstart a Car", type: "youtube", url: "https://www.youtube.com/embed/uW9taTgu7HY" },
  { id: 4, title: "Change Engine Oil", type: "youtube", url: "https://www.youtube.com/embed/O1hF25Cowv8" },
  { id: 5, title: "Fix a Flat Tire", type: "youtube", url: "https://www.youtube.com/embed/MHejWvpibSQ" },
  { id: 6, title: "Replace Wiper Blades", type: "youtube", url: "https://www.youtube.com/embed/fQasirnkdB8" },
  { id: 7, title: "Check Tire Pressure", type: "youtube", url: "https://www.youtube.com/embed/8vVk8oHmvbs" },
  { id: 8, title: "Clean Battery Terminals", type: "youtube", url: "https://www.youtube.com/embed/6kxW3niBJFE" },
  { id: 9, title: "Replace Air Filter", type: "youtube", url: "https://www.youtube.com/embed/RdXVxbd59es" },
  { id: 10, title: "Inspect Spark Plugs", type: "youtube", url: "https://www.youtube.com/embed/0_xGFfketcs" },
  { id: 11, title: "Adjust Headlights", type: "youtube", url: "https://www.youtube.com/embed/t0Sl9CdJdfI" },
  { id: 12, title: "Replace a Car Battery", type: "youtube", url: "https://www.youtube.com/embed/lqd-A6bteqw" },
  { id: 13, title: "Clean the Engine Bay", type: "youtube", url: "https://www.youtube.com/embed/PRSoRkM8GcM" },
  { id: 15, title: "Replace a Fuel Filter", type: "youtube", url: "https://www.youtube.com/embed/lHmRpX8aZ2A" },
  { id: 17, title: "Replace Brake Pads", type: "youtube", url: "https://www.youtube.com/embed/UlbFFq60Tec" },
  { id: 18, title: "Change Coolant Fluid", type: "youtube", url: "https://www.youtube.com/embed/yVdKMIe2Dw0" },
  { id: 19, title: "Replace Cabin Air Filter", type: "youtube", url: "https://www.youtube.com/embed/U42xcI91eIA" },
  { id: 20, title: "Fix a Broken Mirror", type: "youtube", url: "https://www.youtube.com/embed/kugvJRbfm_s" },
];

// Route to fetch DIY videos with pagination
router.get("/api/diy-videos", (req, res) => {
  const limit = parseInt(req.query.limit) || 20; // Default to 8 videos
  const offset = parseInt(req.query.offset) || 0; // Default to offset 0
  
  console.log(`Fetching DIY videos... Limit: ${limit}, Offset: ${offset}`);

  try {
    const paginatedVideos = diyVideos.slice(offset, offset + limit);
    res.json(paginatedVideos); // Send paginated video data as JSON
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: err.message });
  }
});

// Test route to verify API is working
router.get("/test", (req, res) => {
  res.send("Test route working");
});

module.exports = router;
