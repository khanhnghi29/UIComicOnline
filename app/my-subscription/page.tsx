// app/my-subscription/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/app/services/paymentService';
import { SubscriptionPurchase } from '@/app/types';
import { SUBSCRIPTION_PLANS } from '@/app/types';
import { FaHome, FaCrown, FaClock, FaCheckCircle, FaCalendarAlt, FaInfinity, FaSpinner, FaReceipt } from 'react-icons/fa';

export default function MySubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchSubscriptions = async () => {
    try {
      const data = await paymentService.getActiveSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin gói VIP');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expireDate: string) => {
    const now = new Date();
    const expire = new Date(expireDate);
    const diff = expire.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getSubscriptionName = (subscriptionId: number) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.subscriptionId === subscriptionId);
    return plan?.name || 'Gói VIP';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <FaSpinner className="animate-spin" />
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <FaHome className="text-xl" />
                <span>Trang chủ</span>
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaCrown className="text-yellow-500" />
                Gói VIP của tôi
              </h1>
            </div>
            <Link
              href="/my-purchases"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem truyện đã mua
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCrown className="text-yellow-500" />
            Gói đang hoạt động
          </h2>

          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FaCrown className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Chưa có gói VIP nào
              </h3>
              <p className="text-gray-500 mb-6">
                Đăng ký gói VIP để đọc không giới hạn tất cả truyện!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-semibold"
              >
                Đăng ký ngay
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptions.map((sub) => {
                const daysRemaining = getDaysRemaining(sub.expireDate);
                const isExpiringSoon = daysRemaining <= 7;

                return (
                  <div key={sub.purchaseId} className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-white bg-opacity-95 p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FaCrown className="text-yellow-500 text-2xl" />
                            <h3 className="text-xl font-bold text-gray-800">
                              {getSubscriptionName(sub.subscriptionId)}
                            </h3>
                          </div>
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-600">
                            <FaCheckCircle />
                            Đang hoạt động
                          </span>
                        </div>
                        <FaInfinity className="text-4xl text-yellow-500" />
                      </div>

                      {/* Dates */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-3 text-gray-700">
                          <FaCalendarAlt className="text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Ngày đăng ký</div>
                            <div className="font-semibold">
                              {new Date(sub.paymentDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                          <FaClock className="text-orange-600 mt-1" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Ngày hết hạn</div>
                            <div className="font-semibold">
                              {new Date(sub.expireDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                          <FaReceipt className="text-purple-600 mt-1" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Mã giao dịch</div>
                            <div className="font-mono font-semibold text-sm break-all">
                              {sub.transactionId}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 mb-1">Số tiền đã thanh toán</div>
                        <div className="text-3xl font-bold text-green-600">
                          {sub.amount.toLocaleString()} VNĐ
                        </div>
                      </div>

                      {/* Days Remaining */}
                      <div className={`p-4 rounded-lg ${isExpiringSoon ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className={`text-center ${isExpiringSoon ? 'text-red-700' : 'text-blue-700'}`}>
                          <div className="text-3xl font-bold">{daysRemaining}</div>
                          <div className="text-sm">ngày còn lại</div>
                        </div>
                      </div>

                      {isExpiringSoon && (
                        <div className="mt-4 text-center">
                          <Link
                            href="/"
                            className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors text-sm font-semibold"
                          >
                            Gia hạn ngay
                          </Link>
                        </div>
                      )}

                      {/* Purchase ID */}
                      <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
                        Mã đơn hàng: <span className="font-mono font-semibold text-gray-700">#{sub.purchaseId}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Đặc quyền thành viên VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaInfinity className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Đọc không giới hạn</h3>
              <p className="text-gray-600 text-sm">Truy cập toàn bộ kho truyện</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Không quảng cáo</h3>
              <p className="text-gray-600 text-sm">Trải nghiệm đọc truyện mượt mà</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-purple-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Ưu tiên cập nhật</h3>
              <p className="text-gray-600 text-sm">Đọc chapter mới sớm nhất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}