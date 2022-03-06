import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
},
    {
        timestamps: true
    }
);

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', {
    virtuals: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;