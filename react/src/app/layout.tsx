// src/app/layout.tsx
import "../assets/globals.css";
import Header from './components/Header';
import { OrderProvider } from './OrderContext';

export const metadata = {
  title: 'My Application',
  description: 'A Next.js project with TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <OrderProvider>
          <Header />
          <main>{children}</main>
        </OrderProvider>
      </body>
    </html>
  );
}
