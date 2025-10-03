import React from "react";
import { Link } from "react-router-dom";
import { WhyChooseUs } from "./components/ui/why-choose-us";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      {/* <section className="hero">
        <img
          src="https://media.istockphoto.com/id/1154151207/photo/white-bus-traveling-on-the-asphalt-road-around-line-of-trees-in-rural-landscape-at-sunset.jpg?s=612x612&w=0&k=20&c=NLXHp8-e5glAM7t-30Flvcl8R0S_ch8cE5gKghfFbVI="
          alt="Bus travel"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Book Your Bus Tickets Online</h1>
          <p>Hassle-free booking, secure payments, and comfortable journeys across Ethiopia.</p>
          <Link to="/ticket" className="hero-button">
            Find a Bus
          </Link>
        </div>
        
      </section> */}
      <br />
        <div className="text-center mt-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {"Book Your Perfect"}
              <span className="text-primary"> Bus Journey</span>
              <div className="text-lg md:text-xl font-normal text-muted-foreground mt-2">
                Powered by Advanced Future & Technology
              </div>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-8">
              {
                "Experience next-generation bus booking with recommendations, real-time tracking and neural network optimization. Over 1000+ routes across the country."
              }
            </p>
        </div>
      {/* Features Section */}
      {/* <section className="features">
        <h2>Why Travel With Us?</h2>
        <div className="feature-cards">
          <div className="card">
            <img src="https://img.icons8.com/color/96/bus.png" alt="Wide Network" />
            <h3>Nationwide Routes</h3>
            <p>Travel with multiple bus operators across major Ethiopian cities.</p>
          </div>
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Secure Payment" />
            <h3>Secure Payments</h3>
            <p>Pay easily with TeleBirr, CBE Birr, or your preferred method.</p>
          </div>
          <div className="card">
            <img src="https://img.icons8.com/color/96/ticket.png" alt="Easy Booking" />
            <h3>Easy Booking</h3>
            <p>Pick your seat and get instant e-tickets with QR codes.</p>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Your Journey?</h2>

        <Button size="lg" variant="secondary" className="px-8" asChild>
              <Link to="/ticket">Book Your Trip</Link>
            </Button>
      </section>
      <WhyChooseUs />

      {/* NEW SECTION ADDED HERE */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join millions of travelers who trust us for their bus booking needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8" asChild>
              <Link to="/ticket">Book Your Trip</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Download Mobile App
            </Button>
            
          </div>
        </div>
      </section>

      {/* Inline CSS */}
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .hero {
            position: relative;
            height: 80vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            overflow: hidden;
          }
          .hero-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.9;
          }
          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 700px;
            padding: 0 20px;
          }
          .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
          }
          .hero p {
            font-size: 1.2rem;
            margin-bottom: 20px;
          }
          .hero-button {
            background-color: #FFD700;
            color: black;
            padding: 12px 30px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
          }
          .hero-button:hover {
            background-color: #FFC107;
          }
          .features {
            padding: 60px 20px;
            text-align: center;
            background-color: #f5f5f5;
          }
          .features h2 {
            font-size: 2.5rem;
            margin-bottom: 40px;
          }
          .feature-cards {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
          }
          .card {
            background-color: white;
            padding: 20px;
            width: 250px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          }
          .card img {
            width: 80px;
            margin-bottom: 15px;
          }
          .card h3 {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }
          .card p {
            font-size: 0.95rem;
          }
          .cta {
            background-color: #007BFF;
            color: white;
            text-align: center;
            padding: 50px 20px;
          }
          .cta h2 {
            font-size: 2rem;
            margin-bottom: 20px;
          }
          .cta-button {
            background-color: #FFD700;
            color: black;
            padding: 12px 30px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
          }
          .cta-button:hover {
            background-color: #FFC107;
          }
          @media (max-width: 768px) {
            .feature-cards {
              flex-direction: column;
              align-items: center;
            }
            .hero h1 {
              font-size: 2.2rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;