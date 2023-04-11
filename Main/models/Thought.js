const { Schema, model } = require('mongoose');
const reactionSchema = require("./Reaction");
// const thoughtSchema = new Schema({
//   reactionId: {
//     type: Schema.Types.ObjectId,
//     default: () => new Schema.Types.ObjectId()
//   },
//   reactionBody: {
//     type: String,
//     required: true,
//     maxlength: 280
//   },
//   username: {
//     type: String,
//     unique: true,
//       required: true
   
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     get: timestamp => dateFormat(timestamp)
//   }
// });

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // get: timestamp => dateFormat(timestamp)
      get: timestamp => timestamp
    },
    username: {
      type: String,
      unique: true,
      required: true,
    
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;