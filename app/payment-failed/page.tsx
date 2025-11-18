// app/payment-failed/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaTimesCircle, FaRedo } from 'react-icons/fa';

const ERROR_MESSAGES: { [key: string]: string } = {
  '07': 'Giao dịch bị nghi ngờ gian lận',
  '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking',
  '10': 'Xác thực thông tin thẻ không đúng quá 3 lần',
  '11': 'Đã hết hạn chờ thanh toán',
  '12': 'Thẻ/Tài khoản bị khóa',
  '13': 'OTP không chính xác',
  '24': 'Khách hàng hủy giao dịch',
  '51': 'Tài khoản không đủ số dư',
  '65': 'Tài khoản đã vượt quá giới hạn giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Giao dịch vượt quá số lần nhập sai mật khẩu',
  '99': 'Lỗi không xác định'
};

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const code = searchParams?.get('code') || '99';
  const errorMessage = ERROR_MESSAGES[code] || 'Đã có lỗi xảy ra trong quá trình thanh toán';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-6">
            <FaTimesCircle className="text-red-600 text-6xl" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Thanh toán thất bại
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-center text-red-700 font-semibold mb-2">
            {errorMessage}
          </p>
          <p className="text-center text-sm text-gray-600">
            Mã lỗi: <span className="font-mono font-semibold">{code}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Lưu ý:</strong> Nếu tiền đã bị trừ khỏi tài khoản nhưng giao dịch thất bại, 
            số tiền sẽ được hoàn lại trong vòng 1-3 ngày làm việc.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <FaRedo />
            Thử lại
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Về trang chủ
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ? Liên hệ:{' '}
            <a href="mailto:support@kata.com" className="text-blue-600 hover:underline">
              support@kata.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}