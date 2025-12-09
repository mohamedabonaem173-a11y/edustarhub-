// pages/api/create-paymob-order.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body; // in EGP * 100 (cents)
      
      // Request your order token from Paymob (replace with your API key)
      const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMOB_API_KEY}`, // your key
        },
        body: JSON.stringify({
          amount_cents: amount,
          currency: 'EGP',
          delivery_needed: false,
          merchant_order_id: Date.now(),
          items: [
            {
              name: "EdustarHub Subscription",
              amount_cents: amount,
              description: "Monthly subscription for premium content",
              quantity: 1,
            }
          ]
        })
      });

      const data = await response.json();

      // Return the payment token/url for frontend
      res.status(200).json({ token: data.token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create Paymob order' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
