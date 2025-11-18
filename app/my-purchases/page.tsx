// app/my-purchases/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/app/services/paymentService';
import { BookPurchase } from '@/app/types';
import ComicImage from '@/app/components/ComicImage';
import { FaHome, FaBook, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { API_CONFIG } from '@/config/api'; // Import config

//const API_CONFIG.BASE_URL = 'http://localhost:5244';

export default function MyPurchasesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [purchases, setPurchases] = useState<BookPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchPurchases();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchPurchases = async () => {
    try {
      const data = await paymentService.getPurchasedBooks();
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách truyện đã mua');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
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
                <FaBook />
                Truyện đã mua
              </h1>
            </div>
            <Link
              href="/my-subscription"
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
            >
              Xem gói VIP
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

        {purchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Chưa có truyện nào
            </h2>
            <p className="text-gray-500 mb-6">
              Bạn chưa mua truyện nào. Hãy khám phá và mua truyện yêu thích!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá truyện
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div key={purchase.purchaseId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Comic Image */}
                  <Link href={`/comic/${purchase.comicId}`}>
                    <ComicImage
                      src={`${API_CONFIG.BASE_URL}${purchase.comicImageUrl}`}
                      alt={purchase.comicTitle}
                      className="w-full h-64 object-cover"
                    />
                  </Link>

                  {/* Purchase Info */}
                  <div className="p-4">
                    <Link
                      href={`/comic/${purchase.comicId}`}
                      className="block text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2 line-clamp-2"
                    >
                      {purchase.comicTitle}
                    </Link>

                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-600">
                        <FaCheckCircle />
                        Đã mua
                      </span>
                      <div className="text-lg font-bold text-green-600">
                        {purchase.amount.toLocaleString()} VNĐ
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Ngày mua:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(purchase.paymentDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/comic/${purchase.comicId}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Đọc truyện
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600">
                    {purchases.length}
                  </div>
                  <div className="text-gray-600 mt-2">Truyện đã mua</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">
                    {purchases.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} VNĐ
                  </div>
                  <div className="text-gray-600 mt-2">Tổng chi tiêu</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}