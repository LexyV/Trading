const mongoose    = require("mongoose");
const Schema      = mongoose.Schema;

const NotificationSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String
    },
    itemId: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    },
    item: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports     = Notification;