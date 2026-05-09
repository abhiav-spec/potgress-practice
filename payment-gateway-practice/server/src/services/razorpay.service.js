// stub for Razorpay integration
export const createOrder = async (amount) => {
  // in real implementation call Razorpay Orders API
  return { id: `order_${Date.now()}`, amount };
}

export const capture = async (paymentId) => {
  // call Razorpay capture endpoint
  return { id: paymentId, status: 'captured' };
}
