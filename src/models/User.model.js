const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  userId: { //mã người dùng
    type: String,
    required: true,
    unique: true
  },
  userPhone: { //số điện thoại
    type: String,
    required: true
  },
  userPassword: { //mật khẩu
    type: String,
    required: true
  },
  userStatus: { //trạng thái đăng nhập
    type: String,
    required: true
  },
  userRole: { //vai trò
    type: String,
    ref: 'Role',
    required: true
  },
}, { collection: 'User' });

module.exports = mongoose.model('User', UserSchema);
