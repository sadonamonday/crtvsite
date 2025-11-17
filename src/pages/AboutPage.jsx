import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'
import "./About.css";

const About = () => {
  return (
    <>
    <section className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <img
          src="\Images\services\services\safari.jpg"
          alt="CRTVSHOTS Hero"
          className="hero-image"
        />
        <div className="overlay">
          <h1 className="brand-title">CRTVSHOTS</h1>
          <p className="brand-tagline">One Shot At A Time.</p>
        </div>
      </div>

      {/* About Section */}
      <div className="about-content">
  <div className="about-text">
    <h2>About CRTVSHOTS</h2>
    <p>
      CRTVSHOTS is more than a creative outlet—it’s a visual production house
      built on the belief that every frame has the power to move people.
      Based in Johannesburg, CRTVSHOTS operates at the intersection of music,
      fashion, and culture, producing visuals that are bold, cinematic, and
      deeply connected to the communities they represent.
    </p>
    <p>
      The brand thrives on collaboration, working with emerging voices and
      established names alike, ensuring that underground talent gets the same
      level of artistry and attention as mainstream projects. From editorial
      photography to music videos and brand campaigns, CRTVSHOTS delivers
      work that is both visually striking and emotionally resonant.
    </p>
  </div>

  <div className="about-image">
    <img
      src="Images/services/services/fashion show.webp"
      alt="Creative Studio"
      className="section-image"
    />
  </div>
</div>

      {/* Services Section */}
      <div className="services-section">
  <div className="services-content">
    <div className="services-image">
      <img
        src="\Images\services\services\weddingcombo.webp"
        alt="Services"
        className="section-image"
      />
    </div>

    <div className="services-text">
      <h2>What We Do</h2>
      <ul>
        <li>
          📸 <strong>Photography</strong> — Editorial, street, portrait, and
          brand campaigns that capture raw energy and authentic style.
        </li>
        <li>
          🎥 <strong>Videography</strong> — Music videos, visualizers, and
          cinematic storytelling that elevate sound into immersive experiences.
        </li>
        <li>
          🎬 <strong>Creative Direction</strong> — Concept development, mood
          building, and storytelling that align visuals with brand identity.
        </li>
        <li>
          🎨 <strong>Post-Production</strong> — Colour grading, editing, and
          finishing that give every project a polished, signature look.
        </li>
      </ul>
    </div>
  </div>
</div>

    {/* Vision Section */}
<div className="vision-section">
  <h2>Our Vision</h2>
  <p>
    At CRTVSHOTS, our vision is to redefine the boundaries of visual storytelling.
    We aim to document culture as it happens — not just creating content, but
    archiving moments that define a generation. We believe in authenticity,
    inclusivity, and innovation, ensuring that every project reflects the voices
    and stories of the people behind it.
  </p>
</div>

      {/* Mission Section */}
<div className="mission-section">
  <h2>Our Mission</h2>
  <p>
    CRTVSHOTS’ mission is simple yet powerful — to turn dreams into reality, 
    one shot at a time. Every frame we capture and every story we tell aims 
    to inspire, connect, and transform imagination into visual truth.
  </p>
</div>

      {/* Why CRTVSHOTS Stands Out */}
<div className="why-section">
  <h2>Why CRTVSHOTS Stands Out</h2>
  <div className="why-cards">
    <div className="why-card">
      <span className="icon">🌍</span>
      <h3>Culture-First Approach</h3>
      <p>
        Grounded in the streets, music, and fashion scenes of South Africa,
        CRTVSHOTS brings authentic stories to life through bold, cinematic visuals.
      </p>
    </div>

    <div className="why-card">
      <span className="icon">⚡</span>
      <h3>Creative Balance</h3>
      <p>
        From global campaigns to underground shoots, we blend commercial quality
        with grassroots artistry — creating visuals that resonate beyond trends.
      </p>
    </div>

    <div className="why-card">
      <span className="icon">🎨</span>
      <h3>Signature Visual Style</h3>
      <p>
        Our visuals are cinematic, emotional, and impactful — designed to move
        people, spark connection, and define cultural moments.
      </p>
    </div>
  </div>
</div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <h2>Featured Work</h2>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src="\Images\services\services\birthdayphotoshoot.jpg" alt="Birthday Party Photography" />
            <div className="gallery-caption">Birthday Party Photography</div>
          </div>
          
          <div className="gallery-item">
            <img src="\Images\services\services\summit.jpg" alt="Clothing Brand Campaign" />
            <div className="gallery-caption">Brand Campaign</div>
          </div>
          <div className="gallery-item">
            <img src="\Images\services\services\musicvideophoto.jpg" alt="Music Video Still" />
            <div className="gallery-caption">Music Video</div>
          </div>
          <div className="gallery-item">
            <img src="\Images\services\services\musicvideoediting.jpg" alt="Editorial Photography" />
            <div className="gallery-caption">Editorial</div>
          </div>
          <div className="gallery-item">
            <img src="\Images\services\services\matricdancefarewell.jpg" alt="Editorial Photography" />
            <div className="gallery-caption">Matricdance</div>
          </div>
        </div>
      </div>

        {/* Call to Action Section */}
<div className="cta-section">
  <h2>Ready to Create With Us?</h2>
  <p>
    Let's bring your vision to life — book a shoot or creative session today!
  </p>
  <a href="/booking" className="cta-button">Book Now</a>
</div>
    </section>
    
    <Footer />
    </>
  );
};

export default About;
