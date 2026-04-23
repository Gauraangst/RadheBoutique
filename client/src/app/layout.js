import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StoreProvider } from '@/components/store/StoreProvider';

export const metadata = {
  title: 'Radhe Boutique — Designer Kurtis & Statement Jewellery',
  description: 'Discover handcrafted designer kurtis and exquisite statement jewellery at Radhe Boutique. Premium fabrics, timeless designs, and affordable luxury. Shop festive kurtis, everyday wear, and traditional Indian jewellery online.',
  keywords: 'designer kurtis, statement jewellery, Indian fashion, festive wear, silk kurti, kundan jewellery, affordable luxury fashion',
  openGraph: {
    title: 'Radhe Boutique — Grace in Every Thread',
    description: 'Handcrafted designer kurtis & statement jewellery that celebrate femininity and individuality.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
