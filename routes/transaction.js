const express = require('express');
const router = express.Router();
const {getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction,getTransactionHistory } = require('../controllers/transaction')
const {protect} = require('../middleware/auth');

router.route('/').get(getTransactions).post(protect,createTransaction);
router.route('/:id').get(getTransaction).put(updateTransaction).delete(deleteTransaction);
router.route('/history/:id').get(getTransactionHistory);
module.exports = router;