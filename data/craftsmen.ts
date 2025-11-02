import { Craftsman } from '../types';

// Add some sample data to make the app functional without a database.
export const craftsmen: Craftsman[] = [
  {
    id: '1',
    name: 'أحمد نجار',
    craft: 'نجار',
    governorate: 'دمشق',
    bio: 'نجار خبير بخبرة 20 عامًا في صناعة الأثاث المخصص والأعمال الخشبية الفنية. ملتزم بالجودة العالية والدقة في التفاصيل.',
    avatar_url: 'https://images.unsplash.com/photo-1595805371532-1b6b3e0b4a4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1555952494-033f146a2638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1621293290639-1b39235b2a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
      'https://images.unsplash.com/photo-1598421832185-5a5574753f2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
      'https://images.unsplash.com/photo-1618221319982-f728c7f95154?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    ],
    rating: 4.8,
    reviews: 120,
    phone: '912345678',
  },
  {
    id: '2',
    name: 'فاطمة خياطة',
    craft: 'خياطة',
    governorate: 'حلب',
    bio: 'خياطة ماهرة متخصصة في تصميم وتفصيل الفساتين النسائية والملابس التقليدية. أستخدم أجود أنواع الأقمشة لضمان الراحة والأناقة.',
    avatar_url: 'https://images.unsplash.com/photo-1579517262960-5942981c13cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1549062572-544a64f0c542?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1595272890534-119d3a5a4d4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    ],
    rating: 4.9,
    reviews: 250,
    phone: '923456789',
  },
    {
    id: '3',
    name: 'خالد حداد',
    craft: 'حدادة',
    governorate: 'حمص',
    bio: 'حداد فني متخصص في صناعة الأبواب والنوافذ الحديدية المزخرفة والدرابزين. أجمع بين القوة والجمال في كل قطعة أصنعها.',
    avatar_url: 'https://images.unsplash.com/photo-1559628151-524020a5141b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    header_image_url: 'https://images.unsplash.com/photo-1629813247006-6130b623886b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    portfolio: [
      'https://images.unsplash.com/photo-1562993264-b2d95e093952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
      'https://images.unsplash.com/photo-152175938435-c135359a1f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80',
    ],
    rating: 4.7,
    reviews: 85,
    phone: '934567890',
  },
];
