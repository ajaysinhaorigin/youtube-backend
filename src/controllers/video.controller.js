import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const userId = req.user._id;

  if ([title, description].some((field) => field.trim === "")) {
    throw new ApiError(400, "field is required");
  }

  const videoFilelocal = req.files?.videoFile[0]?.path;
  const thumbnailLocal = req.files?.thumbnail[0]?.path;

  if (!videoFilelocal) {
    throw new ApiError(400, "Video file is required");
  }
  if (!thumbnailLocal) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFileupload = await uploadOnCloudinary(videoFilelocal);
  const thumbnailupload = await uploadOnCloudinary(thumbnailLocal);

  if (!videoFileupload) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }
  if (!thumbnailupload) {
    throw new ApiError(500, "Something went wrong while uploading thumbnail");
  }

  //assume that initially the vidoe is published defaultl
  //THIS WILL FAIL AS SIZE OF VIDEO FILE IS TOO LARGE TO BE UPLOADED
  //BECAUSE OF MULTER CONFIGURATION
  //AS VIDEO IS STORE ON THE SERVER AND NOT DIRECTLY ON CLOUDINARY FOR GETTING LINK
  try {
    const video = await Video.create({
      videoFile: videoFileupload.url,
      thumbnail: thumbnailupload.url,
      title,
      description,
      owner: userId,
      duration: videoFileupload.duration,
    });

    const existedVideo = await Video.findById(video._id);

    // not sending videoFile and thumbnail in response (videoFile and thumbnail are cloudinary url)
    if (!existedVideo) {
      throw new ApiError(500, "Something went wrong while uploading video");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(400, existedVideo, "Video uploaded successfully!!")
      );
  } catch (error) {
    console.log("error", error || "Unauthorized user");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
