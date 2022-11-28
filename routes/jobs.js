const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJobById).patch(updateJob).delete(deleteJob);

module.exports = router;
