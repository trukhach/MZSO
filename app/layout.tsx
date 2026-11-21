import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/site-shell';
const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  twitter: { card: 'summary_large_image', title: 'МЗСО — промышленное оборудование', description: 'Конвейерное оборудование и изготовление металлических изделий по чертежам.' },
  openGraph: { type: 'website', locale: 'ru_RU', siteName: 'МЗСО', title: 'МЗСО — промышленное оборудование', description: 'Конвейерное оборудование и изготовление металлических изделий по чертежам.' },
  title: { default: 'МЗСО — промышленное оборудование', template: '%s | МЗСО' },
  description: 'Миасский завод специального оборудования. Производство конвейерного оборудования и металлических изделий. Изготовление по чертежам.'
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body className={inter.className}><a href="#main" className="skip-link">Перейти к содержимому</a><Header/><main id="main" tabIndex={-1}>{children}</main><Footer/></body></html> }