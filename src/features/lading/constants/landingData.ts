import {
  FiUsers, FiHeart, FiAward, FiShield,
  FiTarget, FiZap, FiCheck,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface Feature {
  icon: IconType;
  title: string;
  description: string;
  color: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: IconType;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  rating: number;
  initials: string;
  color: string;
}

export const FEATURES: Feature[] = [
  {
    icon: FiUsers,
    title: 'Спільнота',
    description: 'Тисячі українців, які шукають нових друзів та спілкування',
    color: '#7C4DFF',
  },
  {
    icon: FiHeart,
    title: 'Спільні інтереси',
    description: 'Знаходь людей зі схожими захопленнями та хобі',
    color: '#CE93D8',
  },
  {
    icon: FiAward,
    title: 'Гейміфікація',
    description: 'Челенджі, бейджі та рівні для більш цікавого спілкування',
    color: '#9575CD',
  },
  {
    icon: FiShield,
    title: 'Безпека',
    description: 'Сувора модерація та перевірка профілів для вашого комфорту',
    color: '#B39DDB',
  },
];

export const EXTRA_FEATURES: Feature[] = [
  {
    icon: FiZap,
    title: 'Швидкі знайомства',
    description: "Миттєвий пошук та зв'язок з людьми поруч",
    color: '#7C4DFF',
  },
  {
    icon: FiTarget,
    title: 'Точний відбір',
    description: 'Розумні алгоритми для найкращих збігів',
    color: '#CE93D8',
  },
  {
    icon: FiCheck,
    title: 'Перевірені профілі',
    description: 'Тільки справжні люди з підтвердженими акаунтами',
    color: '#9575CD',
  },
];

export const STEPS: Step[] = [
  {
    number: 1,
    title: 'Створи профіль',
    description: 'Розкажи про себе, свої інтереси та цілі — це займе 2 хвилини',
    icon: FiTarget,
  },
  {
    number: 2,
    title: 'Знаходь людей',
    description: 'Переглядай рекомендації та знаходь тих, хто тобі близький',
    icon: FiUsers,
  },
  {
    number: 3,
    title: 'Спілкуйся',
    description: 'Пиши, приймай виклики та зустрічайся на подіях разом',
    icon: FiZap,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: 'Завдяки Bokado я знайшла справжніх друзів у новому місті. Тепер у нас ціла компанія!',
    author: 'Анна Коваль',
    role: 'Дизайнерка, 24 роки',
    rating: 5,
    initials: 'АК',
    color: '#EDE7F6',
  },
  {
    text: 'Як інтроверту мені важко знайомитись, але тут все зручно та без напруження. Дуже рекомендую.',
    author: 'Олексій Мельник',
    role: 'Розробник, 19 років',
    rating: 5,
    initials: 'ОМ',
    color: '#F3E5F5',
  },
  {
    text: 'Платформа допомогла мені знайти людей з такими ж хобі. Тепер ми регулярно зустрічаємось!',
    author: 'Марія Шевченко',
    role: 'Фотографиня, 27 років',
    rating: 5,
    initials: 'МШ',
    color: '#FCE4EC',
  },
];

export const STATS = [
  { value: '50K+', label: 'користувачів' },
  { value: '200+', label: 'міст України' },
  { value: '1M+', label: 'знайомств' },
  { value: '4.9', label: 'рейтинг у сторах' },
];
