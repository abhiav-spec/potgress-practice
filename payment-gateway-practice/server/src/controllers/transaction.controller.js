import {
  createTransaction,
  getAllTransactions,
  getTransactionsByUserId,
  getTransactionById,
  updateTransactionStatus,
  deleteTransactionById
} from "../models/transaction.model.js";



/**
 * @route POST /api/transactions/create-transaction
 * @desc Create Transaction
 * @access Public
 */
export const createTransactionController =
  async (req, res) => {

    try {

      const transaction =
        await createTransaction(
          req.body
        );


      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        transaction
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};





/**
 * @route GET /api/transactions/get-all-transactions
 * @desc Get All Transactions
 * @access Public
 */
export const getAllTransactionsController =
  async (req, res) => {

    try {

      const transactions =
        await getAllTransactions();


      res.status(200).json({
        success: true,
        count: transactions.length,
        transactions
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};





/**
 * @route GET /api/transactions/get-transaction/:id
 * @desc Get Transaction By ID
 * @access Public
 */
export const getTransactionByIdController =
  async (req, res) => {

    try {

      const { id } = req.params;


      const transaction =
        await getTransactionById(id);


      if (!transaction) {

        return res.status(404).json({
          success: false,
          message: "Transaction not found"
        });
      }


      res.status(200).json({
        success: true,
        transaction
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};





/**
 * @route GET /api/transactions/get-transactions-by-user/:user_id
 * @desc Get Transactions By User ID
 * @access Public
 */
export const getTransactionsByUserController =
  async (req, res) => {

    try {

      const { user_id } = req.params;


      const transactions =
        await getTransactionsByUserId(
          user_id
        );


      res.status(200).json({
        success: true,
        count: transactions.length,
        transactions
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};





/**
 * @route PATCH /api/transactions/update-status/:id
 * @desc Update Transaction Status
 * @access Public
 */
export const updateTransactionStatusController =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;


      const updatedTransaction =
        await updateTransactionStatus(
          id,
          status
        );


      res.status(200).json({
        success: true,
        message: "Transaction status updated",
        transaction: updatedTransaction
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};





/**
 * @route DELETE /api/transactions/delete-transaction/:id
 * @desc Delete Transaction
 * @access Public
 */
export const deleteTransactionController =
  async (req, res) => {

    try {

      const { id } = req.params;


      await deleteTransactionById(id);


      res.status(200).json({
        success: true,
        message: "Transaction deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};