const Conversation = require('../models/conversation');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const createConversation = catchAsyncErrors(async (req, res, next) => {
    try {

        const { groupTitle, userId, sellerId } = req.body;

        const isConversationExist = await Conversation.findOne({ groupTitle });

        if (isConversationExist) {
            const conversation = isConversationExist;
            return res.status(201).json({
                success: true,
                conversation
            })
        }

        const conversation = await Conversation.create({
            members: [userId, sellerId],
            groupTitle: groupTitle,
        });

        res.status(201).json({
            success: true,
            conversation,
            message: "Conversation group successfully been made",
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 500))
    }
});

//get seller conversations
const getAllConvers = catchAsyncErrors(async (req, res, next) => {
    try {

        const conversation = await Conversation.find({
            members: {
                $in: [req.params.id],
            },
        }
        ).sort({ updateAt: -1, createdAt: -1 });

        res.status(201).json({
            success: true,
            conversation
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 500))
    }
});


const updateLastMessage = catchAsyncErrors(async(req, res, next) => {
    try{

        const { lastMessage, lastMessageId } = req.body;

        const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
            lastMessage,
            lastMessageId,
        }, { new: true });

        if (!conversation) {
            return next(new ErrorHandler("Conversation not found", 404));
        }

        res.status(200).json({
            success: true,
            conversation
        })

    } catch (e) {
        return next(new ErrorHandler(e.message, 500))
    }
});

// get user conversations
const getUserConvers = catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.params.id)
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  });


module.exports = {
    createConversation,
    getAllConvers,
    getUserConvers,
    updateLastMessage,
};