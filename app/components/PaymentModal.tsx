// app/components/PaymentModal.tsx
// app/components/PaymentModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/app/types';
import { paymentService } from '@/app/services/paymentService';
import { FaTimes, FaBook, FaCrown, FaCheckCircle } from 'react-icons/fa';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comicId: number;
  comicTitle: string;
  comicPrice: number;
}

type PaymentType = 'book' | 'subscription';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  comicId, 
  comicTitle, 
  comicPrice 
}: PaymentModalProps) {
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<PaymentType>('book');
  const [selectedSubscription, setSelectedSubscription] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      if (!isAuthenticated) {
        setError('Vui lòng đăng nhập để thanh toán');
        setIsProcessing(false);
        return;
      }

      let response;
      
      if (selectedType === 'book') {
        response = await paymentService.purchaseBook(comicId);
      } else {
        response = await paymentService.purchaseSubscription(selectedSubscription);
      }

      // Redirect to VNPay payment URL
      window.location.href = response.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xử lý thanh toán');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Chọn phương thức thanh toán</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isProcessing}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Comic Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Truyện: {comicTitle}</h3>
            <p className="text-gray-600">Giá mua lẻ: <span className="font-bold text-green-600">{comicPrice.toLocaleString()} VNĐ</span></p>
          </div>

          {/* Payment Type Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setSelectedType('book')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                selectedType === 'book'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBook />
              Mua truyện này
            </button>
            <button
              onClick={() => setSelectedType('subscription')}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                selectedType === 'subscription'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaCrown />
              Mua gói đọc không giới hạn
            </button>
          </div>

          {/* Payment Options */}
          {selectedType === 'book' ? (
            <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-blue-600 text-2xl mt-1" />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Mua truyện "{comicTitle}"
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Sở hữu vĩnh viễn và đọc mọi lúc mọi nơi
                  </p>
                  <div className="text-3xl font-bold text-green-600">
                    {comicPrice.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.subscriptionId}
                  onClick={() => setSelectedSubscription(plan.subscriptionId)}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedSubscription === plan.subscriptionId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${
                      selectedSubscription === plan.subscriptionId ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {selectedSubscription === plan.subscriptionId ? (
                        <FaCheckCircle className="text-2xl" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {plan.name}
                      </h4>
                      <p className="text-gray-600 mb-3">{plan.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          {plan.price.toLocaleString()} VNĐ
                        </span>
                        <span className="text-gray-500">
                          / {plan.duration} ngày
                        </span>
                      </div>
                      {plan.subscriptionId > 1 && (
                        <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Tiết kiệm {Math.round((1 - (plan.price / (SUBSCRIPTION_PLANS[0].price * plan.duration / 30))) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              disabled={isProcessing}
            >
              Hủy
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
            </button>
          </div>

          {/* VNPay Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Bạn sẽ được chuyển đến trang thanh toán VNPay an toàn
          </div>
        </div>
      </div>
    </div>
  );
}