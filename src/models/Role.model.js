const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleId: { //mã vai trò
    type: String,
    required: true,
    default: "Driver",
    enum: ['Client', 'Driver', 'Salesman', 'Accountant', 'Warehouse', 'Support']
  },
  roleName: { //tên vai trò
    type: String,
    required: true,
    default: "Tài xế",
    enum: ['Khách hàng', 'Tài xế', 'Nhân viên bán hàng', 'Nhân viên kế toán', 'Nhân viên kho', 'Nhân viên CSKH']
  },
}, { collection: 'Role' });

module.exports = mongoose.model('Role', RoleSchema);
