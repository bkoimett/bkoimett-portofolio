import React from 'react';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import Footer from '../layout/Footer';
import ScrollToTop from '../layout/ScrollToTop';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto h-screen custom-scrollbar relative">
          <div className="max-w-container-max mx-auto px-gutter py-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AdminLayout;