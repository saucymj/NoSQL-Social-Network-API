const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '__v'})
        .then((users) =>
          !users
            ? res.status(404).json({ message: 'No users with that ID' })
            : res.json(users)
        )
        .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
        .then((userData) => res.json(userData))
        .catch((err) => res.status(500).json(err));
    },
    addFriends(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      )
      .then((users) =>
          !users
            ? res.status(404).json({ message: 'No users with that ID' })
            : res.json(users)
      )
      .catch((err) => res.status(500).json(err));
    },
    removeFriends(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
          )
          .then((users) =>
              !users
                ? res.status(404).json({ message: 'No users with that ID' })
                : res.json(users)
          )
          .catch((err) => res.status(500).json(err));
        
    },
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, {$set: req.body})
        .then((users) => 
        !users
        ? res.status(404).json({ message: 'No users with that ID' })
        : res.json(users)
    )
    .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId})
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
    },
};