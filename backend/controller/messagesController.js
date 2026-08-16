const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Messages = require("../models/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const createMessage = catchAsyncErrors(async (req, res, next) => {
  try {

    const messageData = req.body;

    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const filePath = path.join(__dirname, "../uploads", file.filename);
        const imageUrl = await uploadToCloudinary(filePath, "shopo/messages");
        imageUrls.push(imageUrl);
      }

      messageData.images = imageUrls;
    }

    messageData.conversationId = req.body.conversationId;
    messageData.sender = req.body.sender;

    const message = new Messages({
      conversationId: messageData.conversationId,
      text: messageData.text,
      sender: messageData.sender,
      images: messageData.images ? messageData.images : undefined,
    });

    await message.save()

    res.status(201).json({
      success: true,
      message,
    })

  } catch (e) {
    return next(new ErrorHandler(e.message, 500))
  }
});

// get all messages with conversation id
const getAllMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    const messages = await Messages.find({
      conversationId: id
    });

    if (!messages) {
      return next(new ErrorHandler("Message not found", 404));
    }

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message), 500);
  }
});

module.exports = {
  createMessage,
  getAllMessage,
}
