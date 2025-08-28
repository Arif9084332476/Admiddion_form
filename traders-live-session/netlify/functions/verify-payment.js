const { Client } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      email,
      phone,
      experience,
      learning_goals
    } = body;

    // Connect to Neon database
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        experience TEXT,
        learning_goals TEXT,
        payment_id TEXT,
        order_id TEXT,
        status TEXT DEFAULT 'Success',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert registration data
    await client.query(
      `INSERT INTO registrations (name, email, phone, experience, learning_goals, payment_id, order_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, email, phone, experience, learning_goals, razorpay_payment_id, razorpay_order_id]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Registration successful' 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal server error' 
      })
    };
  }
};