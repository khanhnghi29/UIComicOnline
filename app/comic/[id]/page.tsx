
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ComicResponseDto } from '@/app/types';
import ComicImage from '@/app/components/ComicImage';
import NavbarGenres from '@/app/components/NavbarGenres';
import NavbarSearch from '@/app/components/NavbarSearch';
import PaymentModal from '@/app/components/PaymentModal';
import { FaHome, FaShoppingCart, FaCrown } from 'react-icons/fa';
import { API_CONFIG } from '@/config/api'; // Import config

//const API_CONFIG.BASE_URL = 'http://localhost:5244';

export default function ComicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params?.id as string;
  
  const [comic, setComic] = useState<ComicResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Comics/${id}`, { 
          cache: 'no-store' 
        });
        
        if (!response.ok) throw new Error('Failed to fetch comic');
        
        const data = await response.json();
        setComic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComic();
  }, [id]);

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua truyện');
      router.push('/login');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Lỗi khi tải thông tin comic</div>
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold">Kata</Link>
            <Link href="/" className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md">
              <FaHome />
              <span>Trang chủ</span>
            </Link>
            <NavbarGenres />
          </div>
          <NavbarSearch />
        </div>
      </nav>

      <div className="flex justify-center py-8">
        <div className="w-[900px]">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Comic Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Comic Image */}
              <div className="md:col-span-1">
                <ComicImage
                  src={`${API_CONFIG.BASE_URL}${comic.comicImageUrl}`}
                  alt={comic.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              
              {/* Comic Info */}
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{comic.title}</h1>
                
                {/* Author */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Tác giả:</h3>
                  <p className="text-gray-600">{comic.author.authorName}</p>
                </div>
                
                {/* Genres */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Thể loại:</h3>
                  <div className="flex flex-wrap gap-2">
                    {comic.genres.map((genre) => (
                      <span
                        key={genre.genreId}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {genre.genreName}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Lượt xem:</h4>
                      <p className="text-gray-600">{comic.totalViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Số chapters:</h4>
                      <p className="text-gray-600">{comic.chapters.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* Price & Purchase Button */}
                {comic.price > 0 && (
                  <div className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Giá truyện:</h4>
                        <p className="text-2xl text-green-600 font-bold">
                          {comic.price.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePurchaseClick}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        <FaShoppingCart />
                        Mua truyện này
                      </button>
                      <button
                        onClick={handlePurchaseClick}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        <FaCrown />
                        Đăng ký gói VIP
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      Hoặc đăng ký gói VIP để đọc không giới hạn tất cả truyện
                    </p>
                  </div>
                )}
                
                {/* Description */}
                {comic.comicDescription && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Mô tả:</h3>
                    <p className="text-gray-600 leading-relaxed">{comic.comicDescription}</p>
                  </div>
                )}
                
                {/* Created Date */}
                <div className="text-sm text-gray-500">
                  Ngày tạo: {new Date(comic.createAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
            
            {/* Chapters List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Chapters</h2>
              
              {comic.chapters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comic.chapters
                    .sort((a, b) => a.chapterNumber - b.chapterNumber)
                    .map((chapter) => (
                      <Link
                        key={chapter.chapterId}
                        href={`/comic/${comic.comicId}/chapters/${chapter.chapterId}`}
                        className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Chapter {chapter.chapterNumber}
                            </h3>
                            {chapter.chapterTitle && (
                              <p className="text-gray-600 text-sm mt-1">
                                {chapter.chapterTitle}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(chapter.createAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có chapter nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        comicId={comic.comicId}
        comicTitle={comic.title}
        comicPrice={comic.price}
      />
    </div>
  );
}