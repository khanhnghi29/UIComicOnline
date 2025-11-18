
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/app/lib/api';
import { ChapterResponseDto, ComicResponseDto } from '@/app/types';
import ComicImage from '@/app/components/ComicImage';
import NavbarGenres from '@/app/components/NavbarGenres';
import NavbarSearch from '@/app/components/NavbarSearch';
import PaymentModal from '@/app/components/PaymentModal';
import { FaHome, FaLock, FaSpinner, FaShoppingCart, FaCrown } from 'react-icons/fa';
import { API_CONFIG } from '@/config/api'; // Import config

//const API_CONFIG.BASE_URL = 'http://localhost:5244';

type AccessError = {
  type: 'unauthorized' | 'forbidden' | 'not_found' | 'unknown';
  message: string;
  comicPrice?: number;
};

export default function ChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const comicId = params?.id as string;
  const chapterId = params?.chapterId as string;

  const [chapter, setChapter] = useState<ChapterResponseDto | null>(null);
  const [comic, setComic] = useState<ComicResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<AccessError | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      fetchChapter();
      fetchComicForNavigation();
    }
  }, [comicId, chapterId, authLoading, isAuthenticated]);

  const fetchChapter = async () => {
    try {
      setLoading(true);
      setAccessError(null);

      const response = await apiClient.get<ChapterResponseDto>(
        `/Comics/${comicId}/Chapters/${chapterId}`
      );
      
      setChapter(response.data);
    } catch (error: any) {
      console.error('Error fetching chapter:', error);
      
      // Handle different error responses
      if (error.response?.status === 401) {
        setAccessError({
          type: 'unauthorized',
          message: 'Bạn cần đăng nhập để đọc nội dung trả phí này',
          comicPrice: error.response?.data?.price
        });
      } else if (error.response?.status === 403) {
        setAccessError({
          type: 'forbidden',
          message: 'Bạn chưa mua truyện này hoặc chưa có gói VIP',
          comicPrice: error.response?.data?.price
        });
      } else if (error.response?.status === 404) {
        setAccessError({
          type: 'not_found',
          message: 'Không tìm thấy chapter này'
        });
      } else {
        setAccessError({
          type: 'unknown',
          message: 'Có lỗi xảy ra khi tải chapter'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComicForNavigation = async () => {
    try {
      const response = await apiClient.get<ComicResponseDto>(`/Comics/${comicId}`);
      setComic(response.data);
    } catch (error) {
      console.warn('Could not fetch comic for navigation:', error);
    }
  };

  // Navigation logic
  let prevChapter = null;
  let nextChapter = null;
  let currentIndex = -1;

  if (comic && comic.chapters && chapter) {
    const sortedChapters = comic.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    currentIndex = sortedChapters.findIndex(c => c.chapterId.toString() === chapterId);
    prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
    nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <FaSpinner className="animate-spin" />
          Đang tải chapter...
        </div>
      </div>
    );
  }

  // Access Error States
  if (accessError) {
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

        <div className="flex justify-center py-12">
          <div className="max-w-2xl mx-auto px-4">
            {/* Unauthorized - Chưa đăng nhập */}
            {accessError.type === 'unauthorized' && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FaLock className="text-yellow-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Nội dung trả phí
                </h2>
                <p className="text-gray-600 mb-6">
                  {accessError.message}. Vui lòng đăng nhập để tiếp tục.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Đăng nhập ngay
                  </button>
                  <Link
                    href={`/comic/${comicId}`}
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Quay lại trang truyện
                  </Link>
                </div>
              </div>
            )}

            {/* Forbidden - Đã đăng nhập nhưng chưa mua */}
            {accessError.type === 'forbidden' && comic && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FaLock className="text-red-600 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Truyện này yêu cầu thanh toán
                </h2>
                <p className="text-gray-600 mb-6">
                  {accessError.message}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">{comic.title}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {comic.price.toLocaleString()} VNĐ
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    <FaShoppingCart />
                    Mua truyện này
                  </button>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-semibold"
                  >
                    <FaCrown />
                    Đăng ký gói VIP
                  </button>
                  <Link
                    href={`/comic/${comicId}`}
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Quay lại trang truyện
                  </Link>
                </div>
              </div>
            )}

            {/* Not Found */}
            {accessError.type === 'not_found' && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Không tìm thấy chapter
                </h2>
                <p className="text-gray-600 mb-6">
                  Chapter này không tồn tại hoặc đã bị xóa.
                </p>
                <div className="space-y-3">
                  <Link
                    href={`/comic/${comicId}`}
                    className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Quay lại trang truyện
                  </Link>
                  <Link
                    href="/"
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            )}

            {/* Unknown Error */}
            {accessError.type === 'unknown' && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Có lỗi xảy ra
                </h2>
                <p className="text-gray-600 mb-6">
                  {accessError.message}. Vui lòng thử lại sau.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Thử lại
                  </button>
                  <Link
                    href="/"
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal for Forbidden case */}
        {accessError.type === 'forbidden' && comic && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            comicId={parseInt(comicId)}
            comicTitle={comic.title}
            comicPrice={comic.price}
          />
        )}
      </div>
    );
  }

  // Success - Display chapter
  if (!chapter) {
    return null;
  }

  const sortedImages = chapter.chapterImages.sort((a, b) => a.imageOrder - b.imageOrder);

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

      <div className="flex justify-center">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header Navigation */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Link 
                  href={`/comic/${comicId}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  ← {comic ? comic.title : 'Quay lại comic'}
                </Link>
                <h1 className="text-xl font-bold text-gray-800 mt-1">
                  Chapter {chapter.chapterNumber}
                  {chapter.chapterTitle && `: ${chapter.chapterTitle}`}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(chapter.createAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              
              {/* Chapter Navigation */}
              {comic && (
                <div className="flex items-center space-x-2">
                  {prevChapter ? (
                    <Link
                      href={`/comic/${comicId}/chapters/${prevChapter.chapterId}`}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                    >
                      ← Ch. {prevChapter.chapterNumber}
                    </Link>
                  ) : (
                    <div className="px-3 py-2 bg-gray-100 text-gray-400 rounded-md text-sm cursor-not-allowed">
                      ← Ch. trước
                    </div>
                  )}
                  
                  <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold">
                    {currentIndex + 1} / {comic.chapters.length}
                  </span>
                  
                  {nextChapter ? (
                    <Link
                      href={`/comic/${comicId}/chapters/${nextChapter.chapterId}`}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
                    >
                      Ch. {nextChapter.chapterNumber} →
                    </Link>
                  ) : (
                    <div className="px-3 py-2 bg-gray-100 text-gray-400 rounded-md text-sm cursor-not-allowed">
                      Ch. tiếp →
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chapter Images */}
          <div className="space-y-2">
            {sortedImages.length > 0 ? (
              sortedImages.map((image) => (
                <div key={image.imageId} className="text-center">
                  <ComicImage
                    src={`${API_CONFIG.BASE_URL}${image.imageUrl}`}
                    alt={`Page ${image.imageOrder}`}
                    className="w-full h-auto rounded-lg shadow-md mx-auto max-w-full"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chapter này chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          {comic && (prevChapter || nextChapter) && (
            <div className="bg-white rounded-lg shadow-md p-4 mt-6 sticky bottom-4">
              <div className="flex items-center justify-between">
                <div>
                  {prevChapter ? (
                    <Link
                      href={`/comic/${comicId}/chapters/${prevChapter.chapterId}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Chapter trước
                    </Link>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Chapter trước
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/comic/${comicId}`}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                >
                  Danh sách chapter
                </Link>
                
                <div>
                  {nextChapter ? (
                    <Link
                      href={`/comic/${comicId}/chapters/${nextChapter.chapterId}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Chapter tiếp theo
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                      Chapter tiếp theo
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}