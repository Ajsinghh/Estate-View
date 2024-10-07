const mongoose  = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://imgs.search.brave.com/GJVMGeh-7BfPySUqjlcI06oQDnZqAqAAs02fdKX_la8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3R5bGlzaC1k/ZWZhdWx0LXVzZXIt/cHJvZmlsZS1waG90/by1hdmF0YXItdmVj/dG9yLWlsbHVzdHJh/dGlvbl82NjQ5OTUt/MzUyLmpwZz9zaXpl/PTYyNiZleHQ9anBn",
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;