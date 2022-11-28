const Job = require("./../models/job");
const { StatusCodes } = require("http-status-codes");
const job = require("./../models/job");
const { NotFoundError, BadRequestError } = require("../error");

const createJob = async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const createdJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(createdJob);
};

const getAllJobs = async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user._id })
    .select("-createdAt -updatedAt -__v")
    .populate("createdBy", "username")
    .sort({
      createdAt: 1,
    });
  res.status(StatusCodes.OK).json(jobs);
};

const getJobById = async (req, res, next) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id })
    .select("-createdAt -updatedAt -__v")
    .populate("createdBy", "username");
  if (!job) {
    return next(new NotFoundError("Job not found"));
  }
  res.status(StatusCodes.OK).json(job);
};

const updateJob = async (req, res, next) => {
  const { companyName, position } = req.body;
  if (!companyName || !position) {
    return next(new BadRequestError("Job not found"));
  }

  const updateJob = await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateJob) {
    return next(new NotFoundError("Job not found"));
  }
  res.status(StatusCodes.OK).json(updateJob);
};

const deleteJob = async (req, res, next) => {
  const {
    params: { id },
    user: { _id: userId },
  } = req;

  const deletedJob = await Job.findOneAndRemove({ _id: id, createdBy: userId });
  if (!deletedJob) {
    return next(new NotFoundError("Job not found"));
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
};
