import ReservationForm from './Booking/ReservationForm';
import Hero from './Hero';
import Menu from './Menu';
import About from './About';
import Gallery from './Gallery';
import PremisesPayment from './PremisesPayment';
import Contact from './Contact';


const Home = ({ addToCart, showToast, user, cart, clearCart }) => {
  return (
    <>
      <Hero />
      <Menu addToCart={addToCart} />
      <About />
      <Gallery />
      <section id="reserve" className="container">
          <div className="reservation">
              <h2 className="section-title">Make a Reservation</h2>
              <p className="section-subtitle">Book your table for an unforgettable dining experience</p>
              
              <ReservationForm 
                showToast={showToast} 
                user={user} 
                cart={cart} 
                clearCart={clearCart} 
              />
          </div>
      </section>
      <PremisesPayment showToast={showToast} user={user} />
      <Contact />
    </>
  );
};

export default Home;
