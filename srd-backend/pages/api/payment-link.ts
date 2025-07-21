// pages/api/payment-link.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePaystackPaymentLink } from '../../utils/paystack';
import { authMiddleware } from '../../middleware/authMiddleware';

/**
 * @swagger
 * /api/payment-link:
 *   post:
 *     summary: Generate a Paystack payment link
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - amount
 *               - purpose
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Name of the client
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount in NGN (e.g., 1000.00 for ₦1000)
 *               purpose:
 *                 type: string
 *                 description: Purpose of the payment (e.g., "PR Consultation Fee")
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Optional client email for Paystack
 *     responses:
 *       200:
 *         description: Payment link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *                   format: url
 *                   description: The generated Paystack payment URL
 *                 reference:
 *                   type: string
 *                   description: Paystack transaction reference
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export default authMiddleware(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { clientName, amount, purpose, email } = req.body;

  if (!clientName || !amount || !purpose) {
    return res.status(400).json({ message: 'Client name, amount, and purpose are required.' });
  }

  // Paystack amount is in kobo (1 NGN = 100 kobo)
  const amountInKobo = Math.round(amount * 100);

  try {
    const paymentDetails = await generatePaystackPaymentLink(email, amountInKobo, purpose, clientName);
    res.status(200).json(paymentDetails);
  } catch (error: any) {
    console.error('Error generating Paystack link:', error);
    res.status(500).json({ message: error.message || 'Failed to generate payment link.' });
  }
});