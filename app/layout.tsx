import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/site-shell';
const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });
export const metadata: Metadata = { title: { default: 'МЗСО — промышленное оборудование', template: '%s | МЗСО' }, description: 'Миасский завод специального оборудования. Производство конвейерного оборудования и металлических изделий. Изготовление по чертежам.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body className={inter.className}><Header/><main id="main">{children}</main><Footer/></body></html> }