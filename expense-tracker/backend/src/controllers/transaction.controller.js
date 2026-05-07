import {createTransaction, getTransactionsByUser, getAllTransactions, deleteTransaction} from "../models/transaction.model.js";

export const createTransactionController = async (req, res) => {
    try{
        const {user_id, category_id, amount, type, note, transaction_date} = req.body;
    
    if(!user_id || !category_id || !amount || !type || !transaction_date){
        return res.status(400).json({error: "Missing required fields"});
    }

    const transaction = await createTransaction(user_id, category_id, amount, type, note, transaction_date);
    res.status(201).json(transaction);
}catch(error){
    console.error("Error creating transaction:", error);
    res.status(500).json({error: "Failed to create transaction"});
}
};

export const getTransactionsByUserController = async (req, res) => {
    try{
        const user_id = req.params.user_id;
    const transactions = await getTransactionsByUser(user_id);
    res.json(transactions);
}catch(error){
    console.error("Error fetching transactions:", error);
    res.status(500).json({error: "Failed to fetch transactions"});
}
};
    

export const getAllTransactionsController = async (req, res) => {
    try{
        const transactions = await getAllTransactions();
    res.json(transactions);
}catch(error){
    console.error("Error fetching transactions:", error);
    res.status(500).json({error: "Failed to fetch transactions"});
}
};


export const deleteTransactionController = async (req, res) => {
    try{
        const id = req.params.id;
    await deleteTransaction(id);
    res.status(204).send();
}catch(error){
    console.error("Error deleting transaction:", error);
    res.status(500).json({error: "Failed to delete transaction"});
}
};

