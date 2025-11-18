// app/payment-success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaBook, FaCrown } from 'react-icons/fa';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const type = searchParams?.get('type'); // 'book' or 'subscription'
  const id = searchParams?.get('id');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (type === 'book') {
            router.push('/my-purchases');
          } else {
            router.push('/my-subscription');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <FaCheckCircle className="text-green-600 text-6xl" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Thanh toán thành công!
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          {type === 'book' 
            ? 'Bạn đã mua truyện thành công. Giờ bạn có thể đọc truyện này bất cứ lúc nào.'
            : 'Bạn đã đăng ký gói VIP thành công. Giờ bạn có thể đọc không giới hạn tất cả truyện.'
          }
        </p>

        {/* Purchase Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            {type === 'book' ? (
              <FaBook className="text-blue-600 text-xl" />
            ) : (
              <FaCrown className="text-yellow-500 text-xl" />
            )}
            <span className="font-semibold text-gray-800">
              {type === 'book' ? 'Mua truyện' : 'Gói VIP'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Mã đơn hàng: <span className="font-mono font-semibold">#{id}</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="text-center text-sm text-gray-500 mb-6">
          Tự động chuyển hướng sau {countdown} giây...
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {type === 'book' ? (
            <Link
              href="/my-purchases"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Xem truyện đã mua
            </Link>
          ) : (
            <Link
              href="/my-subscription"
              className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Xem gói VIP của tôi
            </Link>
          )}
          
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}