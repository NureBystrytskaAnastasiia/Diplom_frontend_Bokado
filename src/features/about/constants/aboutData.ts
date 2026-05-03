import {
  FiHeart, FiShield, FiUsers, FiZap, FiEye, FiStar,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface Value {
  icon: IconType;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const MISSION = {
  eyebrow: 'Наша місія',
  title: 'Зробити самотність неможливою',
  paragraphs: [
    'Bokado народився із простої ідеї: в Україні мільйони людей мають спільні інтереси, живуть поруч — але ніколи не зустрічаються. Ми вирішили це змінити.',
    "Ми будуємо простір, де знайомства відбуваються природно — через спільні захоплення, челенджі та реальні події. Не свайпи заради свайпів, а справжні зв'язки між людьми.",
    'Bokado — це не черговий додаток. Це рух за живе людське спілкування в цифрову епоху.',
  ],
};

export const STATS: Stat[] = [
  { value: '50K+',  label: 'користувачів' },
  { value: '200+',  label: 'міст України' },
  { value: '1M+',   label: 'знайомств' },
  { value: '2023',  label: 'рік заснування' },
];

export const VALUES: Value[] = [
  {
    icon: FiHeart,
    title: 'Справжність',
    description: 'Ми цінуємо реальні зв\'язки. Жодних ботів, жодних фейків — тільки живі люди з реальними інтересами.',
    color: '#CE93D8',
    bg: '#F3E5F5',
  },
  {
    icon: FiUsers,
    title: 'Спільнота',
    description: 'Кожна людина заслуговує на своє коло спілкування. Ми робимо все, щоб ти його знайшла.',
    color: '#7C4DFF',
    bg: '#EDE7F6',
  },
  {
    icon: FiShield,
    title: 'Безпека',
    description: 'Ми стежимо за тим, щоб платформа залишалась безпечним простором. Суворa модерація — наш пріоритет.',
    color: '#9575CD',
    bg: '#EDE7F6',
  },
  {
    icon: FiZap,
    title: 'Енергія',
    description: 'Ми віримо, що знайомства мають бути легкими і захопливими — тому додаємо гейміфікацію і виклики.',
    color: '#B39DDB',
    bg: '#F3F0FA',
  },
  {
    icon: FiEye,
    title: 'Прозорість',
    description: 'Ми чесні з нашими користувачами: немає прихованих алгоритмів, немає продажу даних.',
    color: '#CE93D8',
    bg: '#F3E5F5',
  },
  {
    icon: FiStar,
    title: 'Розвиток',
    description: 'Ми постійно вдосконалюємось — слухаємо спільноту та будуємо продукт разом з нею.',
    color: '#7C4DFF',
    bg: '#EDE7F6',
  },
];
