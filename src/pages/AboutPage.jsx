import React from 'react';
import Header from '../components/Header';
import "./About.css";

const About = () => {
  return (
    <section className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <img
          src="/images/crtvshots-hero.jpg"
          alt="CRTVSHOTS Hero"
          className="hero-image"
        />
        <div className="overlay">
          <h1 className="brand-title">CRTVSHOTS</h1>
          <p className="brand-tagline">One Shot. Take It.</p>
        </div>
      </div>

      {/* About Section */}
      <div className="about-content">
        <h2>About CRTVSHOTS</h2>
        <p>
          CRTVSHOTS is more than a creative outlet—it’s a visual production house
          built on the belief that every frame has the power to move people.
          Based in Johannesburg, CRTVSHOTS operates at the intersection of music,
          fashion, and culture, producing visuals that are bold, cinematic, and
          deeply connected to the communities they represent.
        </p>
        <img
          src="Images/services/services/fashion show.webp"
          alt="Creative Studio"
          className="section-image"
        />
        <p>
          The brand thrives on collaboration, working with emerging voices and
          established names alike, ensuring that underground talent gets the same
          level of artistry and attention as mainstream projects. From editorial
          photography to music videos and brand campaigns, CRTVSHOTS delivers
          work that is both visually striking and emotionally resonant.
        </p>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <h2>What We Do</h2>
        <img
          src="\Images\services\services\weddingcombo.webp"
          alt="Services"
          className="section-image"
        />
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

      {/* Vision Section */}
      <div className="vision-section">
        <h2>Our Vision</h2>
        <p>
          CRTVSHOTS is committed to documenting culture as it happens—not just
          creating content, but archiving moments that define a generation. The
          brand’s philosophy is rooted in authenticity, inclusivity, and
          innovation, ensuring that every project reflects the voices and stories
          of the people behind it.
        </p>
      </div>

      {/* Why CRTVSHOTS Stands Out */}
      <div className="why-section">
        <h2>Why CRTVSHOTS Stands Out</h2>
        <ul>
          <li>
            🌍 <strong>Culture-first approach</strong>: grounded in the streets,
            music, and fashion scenes of South Africa.
          </li>
          <li>
            ⚡ <strong>Balance of commercial and grassroots work</strong>: from
            global campaigns to free shoots for underground talent.
          </li>
          <li>
            🎨 <strong>Signature visual style</strong>: bold contrasts, cinematic
            tones, and storytelling that resonates beyond the screen.
          </li>
        </ul>
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
            <img src="\Images\services\services\corporatevideo.webp" alt="Clothing Brand Campaign" />
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

        <div className="cta-section">
    <h2>Ready to Create With Us?</h2>
    <p>Let’s bring your vision to life — book a shoot or creative session today!</p>
    <a href="/booking" className="cta-button">Book Now</a>
  </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Let’s Create</h2>
        <p>
          📧 <a href="mailto:crtvshots1@gmail.com">crtvshots1@gmail.com</a>
        </p>
        <p>📱 +27 63 925 8426</p>
        <p>
          📸 Instagram:{" "}
          <a href="https://instagram.com/crtvshots" target="_blank" rel="noreferrer">
            @crtvshots
          </a>
        </p>
      </div>
    </section>
  );
};

export default About;
