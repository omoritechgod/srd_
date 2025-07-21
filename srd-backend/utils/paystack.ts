// utils/paystack.ts
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API_BASE_URL = 'https://api.paystack.co';

export const generatePaystackPaymentLink = async (
  email: string,
  amount: number, // in kobo
  purpose: string,
  clientName: string
) => {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key not configured.');
  }

  try {
    const response = await axios.post(
      `${PAYSTACK_API_BASE_URL}/transaction/initialize`,
      {
        email: email || 'customer@example.com', // Fallback email if not provided
        amount: amount, // amount in kobo
        metadata: {
          purpose: purpose,
          clientName: clientName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status) {
      return {
        link: response.data.data.authorization_url,
        reference: response.data.data.reference,
      };
    } else {
      throw new Error(response.data.message || 'Failed to initialize Paystack transaction.');
    }
  } catch (error: any) {
    console.error('Paystack API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error generating payment link.');
  }
};