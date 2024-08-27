import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const {videoId} = req.params
    
    
  if (!content || content.trim() == "") {
    throw new ApiError(400, "field is required");
  }

  try {
    const existingVideo = await Video.findById(
      new mongoose.Types.ObjectId(videoId)
    );
    if (!existingVideo) {
      throw new ApiError(400, "Video does not found");
    }

    console.log("existing video", existingVideo);

    const comment = await Comment.create({
      content,
      video:videoId,
      owner: req.user._id,
    });

    if (!comment) {
      throw new ApiError(500, "Something went wrong while adding comment");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while adding comment");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
