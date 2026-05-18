const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, searchEmployees, deleteEmployee, updateEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addEmployee);
router.get('/', protect, getEmployees);
router.get('/search', protect, searchEmployees);
router.delete('/:id', protect, deleteEmployee);
router.put('/:id', protect, updateEmployee);

module.exports = router;
