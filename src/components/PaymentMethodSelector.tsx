import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Building2, 
  Copy, 
  Check, 
  ArrowLeft, 
  MessageCircle,
  Globe,
  ChevronDown,
  AlertCircle,
  Send
} from 'lucide-react';

interface BankDetails {
  currency: string;
  currencySymbol: string;
  name: string;
  accountNumber: string;
  bank: string;
}

interface PaymentMethodSelectorProps {
  bookingId: string;
  onPaystackSelected: () => void;
  onBankTransferSubmit: (data: BankTransferSubmitData) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export interface BankTransferSubmitData {
  booking_id: string;
  currency: string;
  payment_method: 'bank_transfer';
}

const bankDetailsData: BankDetails[] = [
  {
    currency: 'NGN',
    currencySymbol: '₦',
    name: 'SRD CONSULTING LIMITED',
    accountNumber: '0010162156',
    bank: 'PremiumTrust Bank'
  },
  {
    currency: 'USD',
    currencySymbol: '$',
    name: 'SRD CONSULTING LIMITED',
    accountNumber: '0330084831',
    bank: 'PremiumTrust Bank'
  },
  {
    currency: 'GBP',
    currencySymbol: '£',
    name: 'SRD CONSULTING LIMITED',
    accountNumber: '0330084848',
    bank: 'PremiumTrust Bank'
  },
  {
    currency: 'EUR',
    currencySymbol: '€',
    name: 'SRD CONSULTING LIMITED',
    accountNumber: '0330084855',
    bank: 'PremiumTrust Bank'
  }
];

const whatsappNumber = '+234 816 504 5779';

type PaymentMethod = 'selection' | 'paystack' | 'bank_transfer';

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  bookingId,
  onPaystackSelected,
  onBankTransferSubmit,
  onBack,
  isSubmitting
}) => {
  const [step, setStep] = useState<PaymentMethod>('selection');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string>('');
  const [error, setError] = useState<string>('');

  const selectedBankDetails = bankDetailsData.find(b => b.currency === selectedCurrency);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBankTransferSubmit = async () => {
    if (!selectedCurrency) {
      setError('Please select a currency');
      return;
    }

    setError('');
    
    await onBankTransferSubmit({
      booking_id: bookingId,
      currency: selectedCurrency,
      payment_method: 'bank_transfer'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  // Step 1: Payment Method Selection
  if (step === 'selection') {
    return (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            Select Payment Method
          </h2>
          <p className="text-gray">
            Choose how you'd like to complete your payment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Paystack/Online Payment Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPaystackSelected}
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 rounded-2xl p-6 text-left transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">
              Pay Online (Naira)
            </h3>
            <p className="text-gray text-sm mb-3">
              Pay securely with your debit card via Paystack
            </p>
            <div className="flex items-center text-green-600 font-medium text-sm">
              <span>Nigerian Naira (₦)</span>
            </div>
          </motion.button>

          {/* Bank Transfer Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('bank_transfer')}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 text-left transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">
              Bank Transfer
            </h3>
            <p className="text-gray text-sm mb-3">
              Transfer directly to our bank account
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              <Globe className="w-4 h-4 mr-1" />
              <span>NGN, USD, GBP, EUR</span>
            </div>
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray">
            🔒 All payments are secure and encrypted
          </p>
        </div>
      </motion.div>
    );
  }

  // Step 2: Bank Transfer Details
  if (step === 'bank_transfer') {
    return (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setStep('selection');
              setSelectedCurrency('');
              setError('');
            }}
            className="inline-flex items-center text-gray hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payment Options
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            Bank Transfer Payment
          </h2>
          <p className="text-gray">
            Select your preferred currency and transfer to our account
          </p>
        </div>

        {/* Currency Selection */}
        <div className="max-w-xl mx-auto mb-8">
          <label className="block text-sm font-medium text-dark mb-3">
            Select Currency *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bankDetailsData.map((bank) => (
              <button
                key={bank.currency}
                onClick={() => {
                  setSelectedCurrency(bank.currency);
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedCurrency === bank.currency
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-primary/50 text-dark'
                }`}
              >
                <div className="text-2xl font-bold mb-1">{bank.currencySymbol}</div>
                <div className="text-sm font-medium">{bank.currency}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bank Details Display */}
        {selectedBankDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                Bank Details ({selectedBankDetails.currency})
              </h3>
              
              <div className="space-y-4">
                {/* Account Name */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray uppercase tracking-wide mb-1">Account Name</p>
                      <p className="font-semibold text-dark">{selectedBankDetails.name}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBankDetails.name, 'name')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy account name"
                    >
                      {copiedField === 'name' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray uppercase tracking-wide mb-1">Account Number</p>
                      <p className="font-semibold text-dark text-lg tracking-wider">
                        {selectedBankDetails.accountNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBankDetails.accountNumber, 'account')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy account number"
                    >
                      {copiedField === 'account' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bank Name */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray uppercase tracking-wide mb-1">Bank Name</p>
                      <p className="font-semibold text-dark">{selectedBankDetails.bank}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBankDetails.bank, 'bank')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy bank name"
                    >
                      {copiedField === 'bank' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Evidence Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-dark mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                Send Payment Evidence
              </h3>
              <p className="text-gray text-sm mb-4">
                After making the transfer, please send your payment receipt/screenshot to:
              </p>
              <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray uppercase tracking-wide mb-1">WhatsApp Number</p>
                  <p className="font-semibold text-dark text-lg">{whatsappNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(whatsappNumber.replace(/\s/g, ''), 'whatsapp')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy WhatsApp number"
                >
                  {copiedField === 'whatsapp' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray" />
                  )}
                </button>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\s/g, '').replace('+', '')}?text=Hi, I just made a bank transfer payment for my consultation booking (ID: ${bookingId}). Here is my payment evidence:`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Open WhatsApp to Send Evidence
              </a>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              onClick={handleBankTransferSubmit}
              disabled={isSubmitting || !selectedCurrency}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center py-4"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  I Have Made Payment
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray mt-4">
              By clicking this button, you confirm that you have transferred the payment to the account above.
            </p>
          </motion.div>
        )}

        {/* Instructions when no currency selected */}
        {!selectedCurrency && (
          <div className="max-w-xl mx-auto text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChevronDown className="w-8 h-8 text-gray animate-bounce" />
            </div>
            <p className="text-gray">
              Select a currency above to view bank account details
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
};

export default PaymentMethodSelector;
