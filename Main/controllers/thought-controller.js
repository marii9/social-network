const { User, Thought } = require('../models');

const thoughtController = {
  // GET all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  

  // GET a single thought by its _id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST a new thought
  addThought  (req, res)  {
    const { userId, thoughtText, username } = req.body;

    Thought.create({ thoughtText, username })
      .then((newThought) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { thoughts: newThought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json({ message: 'Thought created!' });
      })
      .catch((err) => res.status(500).json(err));
},

  // PUT to update a thought by its _id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this ID' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE a thought by its _id
  removeThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        return User.findOneAndUpdate(
          { _id: thought.userId },
          { $pull: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json({ message: 'Thought deleted!' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST to add a reaction to a thought
  addReaction(req, res) {
    const { reactionBody, username } = req.body;

    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE to remove a reaction from a thought
  removeReaction(req, res) {
    const { reactionId } = req.params;
    const { thoughtId } = req.params;
    Thought.findByIdAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId: reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  }
}
module.exports = thoughtController;