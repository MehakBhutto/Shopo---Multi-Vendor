const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Messages = require("../models/messages");
const ErrorHandler = require("../utils/ErrorHandler");

const createMessage = catchAsyncErrors(async(req, res, next) => {
    try{

        const messageData = req.body;

        if(req.files) {
            const files = req.files;
            const imageUrl = files.map((file) => `${file.filename}`);

            messageData.images = imageUrl;
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
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
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