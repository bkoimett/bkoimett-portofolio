import React from 'react';
import Navbar from '../Navbar';
import Footer from '../layout/Footer';
import ScrollToTop from '../layout/ScrollToTop';
import CookieConsent from '../CookieConsent';
import WhatsAppButton from '../WhatsAppButton';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;