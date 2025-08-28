const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount } = JSON.parse(event.body);
    
    // DIRECT VALUES - यहाँ अपना Razorpay secret key डालें
    const RAZORPAY_KEY_ID = "rzp_test_R5Dp98mCaSgQDM";
    const RAZORPAY_KEY_SECRET = "Mt1Q0V7byadRkObrayiC8VTi"; // ← यहाँ अपना secret key डालें

    // Create order using Razorpay API
    const response = await axios.post('https://api.razorpay.com/v1/orders', {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
      payment_capture: 1
    }, {
      auth: {
        username: rzp_test_R5Dp98mCaSgQDM,
        password: Mt1Q0V7byadRkObrayiC8VTi
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create order' })
    };
  }
};