import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CreditCard, Copy, MessageCircle, ExternalLink, Check } from 'lucide-react';
import api from '../../services/api';

interface PaymentForm {
  clientName: string;
  amount: number;
  purpose: string;
  email?: string;
}

interface PaymentLink {
  link: string;
  reference: string;
}

const PaymentLink: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentForm>();

  const onSubmit = async (data: PaymentForm) => {
    setSubmitting(true);
    try {
      const response = await api.post('/payment-link', data);
      setPaymentLink(response.data);
    } catch (error) {
      console.error('Failed to generate payment link:', error);
      alert('Failed to generate payment link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const shareViaWhatsApp = (link: string, clientName: string, amount: number, purpose: string) => {
    const message = `Hi ${clientName},

Here's your payment link for ${purpose}:

Amount: ₦${amount.toLocaleString()}
Payment Link: ${link}

Please click the link to complete your payment securely via Paystack.

Thank you!
SRD Consulting Ltd`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetForm = () => {
    reset();
    setPaymentLink(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-dark">Payment Link Generator</h1>
              <p className="text-gray">Generate secure Paystack payment links for clients</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark">Create Payment Link</h2>
                <p className="text-gray">Generate a secure payment link for your client</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Client Name *
                </label>
                <input
                  {...register('clientName', { required: 'Client name is required' })}
                  className="input-field"
                  placeholder="Enter client's full name"
                />
                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Client Email (Optional)
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="client@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Amount (₦) *
                </label>
                <input
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 100, message: 'Minimum amount is ₦100' },
                    valueAsNumber: true
                  })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Purpose/Description *
                </label>
                <textarea
                  {...register('purpose', { required: 'Purpose is required' })}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="e.g., PR Consultation Fee, Media Relations Package, etc."
                />
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Generate Payment Link
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Payment Link Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            {paymentLink ? (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark">Payment Link Generated</h3>
                    <p className="text-gray">Share this link with your client</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Payment Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={paymentLink.link}
                        readOnly
                        className="input-field flex-1 bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(paymentLink.link)}
                        className="btn-secondary flex items-center"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={paymentLink.reference}
                      readOnly
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div className="flex flex-col space-y-3 pt-4">
                    <button
                      onClick={() => window.open(paymentLink.link, '_blank')}
                      className="btn-primary flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Payment Link
                    </button>

                    <button
                      onClick={() => {
                        const form = document.querySelector('form') as HTMLFormElement;
                        const formData = new FormData(form);
                        shareViaWhatsApp(
                          paymentLink.link,
                          formData.get('clientName') as string,
                          Number(formData.get('amount')),
                          formData.get('purpose') as string
                        );
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Share via WhatsApp
                    </button>

                    <button
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      Generate Another Link
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">No Payment Link Yet</h3>
                <p className="text-gray">
                  Fill out the form to generate a secure payment link for your client
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-sm p-8"
        >
          <h3 className="text-lg font-semibold text-dark mb-4">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Generate Link',
                description: 'Fill out the client details and amount to create a secure payment link'
              },
              {
                step: '2',
                title: 'Share with Client',
                description: 'Copy the link or share directly via WhatsApp with a pre-filled message'
              },
              {
                step: '3',
                title: 'Receive Payment',
                description: 'Client pays securely through Paystack and you receive confirmation'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-dark mb-2">{item.title}</h4>
                <p className="text-gray text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentLink;