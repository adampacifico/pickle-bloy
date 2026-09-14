import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import BookingWizard from '../components/booking/BookingWizard';
import Events from '../components/Events';
import ScheduleSection from '../components/ScheduleSection';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

/**
 * The public, visitor-facing page: hero → gallery → booking wizard →
 * events → schedule. No admin here — that lives at /admin.
 */
export default function PublicPage() {
  const [viewingBooking, setViewingBooking] = useState(null);

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Gallery />
        <BookingWizard onViewBooking={setViewingBooking} />
        <Events />
        <ScheduleSection />
      </main>
      <Footer />
      {viewingBooking && (
        <Modal booking={viewingBooking} onClose={() => setViewingBooking(null)} />
      )}
    </div>
  );
}