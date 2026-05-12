import {createRazorpayOrder,verifyPaymentSignature} from "../services/payment.service";
import {createTransaction,updateTransactionSuccess,updateTransactionFailed} from "../models/transaction.model.js";

/**
 * @route POST /api/payment/create-order
 * @desc Create a new Razorpay order and save transaction details in the database
 * @access Public
 */

export const createorder = async (req,res) => {
    try{
        const {user_id,amount} = req.body;
        //create order in Razorpay

        const order = await createRazorpayOrder(amount);

        // save tranasction details in database 

        const transaction = await createTransaction({
            user_id,
            order_id: order.id,
            amount,
            status: "created"
        });

        res.status(201).json({
            success: true,
            order,
            transaction
        });
    }catch(error){
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating Razorpay order"
        });
    }
}

/**
 * @route POST /api/payment/verify-payment
 * @desc Verify Razorpay payment signature and update transaction status in the database
 * @access Public
 */

export const verifypayment = async (req,res) => {
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        // verify payment signature
        if(!verifyPaymentSignature(razorpay_order_id,razorpay_payment_id,razorpay_signature)){    
           await updateTransactionFailed(razorpay_order_id);
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }
        // update transaction status
        const transaction = await updateTransactionSuccess({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });
        res.status(200).json({
            success: true,
            transaction
        });
    }catch(error){
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying Razorpay payment"
        });
    }finally{
        try{
            // delete the order from Razorpay
            await deleteOrder(razorpay_order_id);
        }catch(error){
            console.error("Error deleting Razorpay order:", error);
            
        }
    }
}
