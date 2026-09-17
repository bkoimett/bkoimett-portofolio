import React from 'react';
import Navbar from '../Navbar';
import Footer from '../layout/Footer';
import ScrollToTop from '../layout/ScrollToTop';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="pt-12">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;