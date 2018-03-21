const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    category: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String 
    },
    image: { 
        type: String 
    },
    description: { 
        type: String 
    },
    owner: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    } ,
    userName: {
        type: String
    }
    },
    {
        timestamps: true
    }
);

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;