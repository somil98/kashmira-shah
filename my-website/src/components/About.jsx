export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Me</h2>
          <p>Bringing quality and elegance to your table</p>
        </div>
        <div className="about-content">
          <div className="about-image">
            <img src="/kashmira-shah/me.jpg" alt="Kashmira Shah" className="profile-image" />
          </div>
          <div className="about-text">
            <h3>Kashmira Shah</h3>
            <p className="about-role">Business Development Professional</p>
            <p>
              With over 10 years of experience in sales and business development, I specialize in bringing premium crockery solutions to discerning customers. I represent <strong>Ektra by Srithai Superware</strong>, a trusted brand known for quality and innovation in kitchenware.
            </p>
            <p>
              My commitment is to provide you with the finest crockery products that combine functionality with aesthetic appeal, perfect for both everyday use and special occasions.
            </p>
            <div className="about-stats">
              <div className="stat">
                <h4>10+</h4>
                <p>Years Experience</p>
              </div>
              <div className="stat">
                <h4>1000+</h4>
                <p>Happy Customers</p>
              </div>
              <div className="stat">
                <h4>100%</h4>
                <p>Quality Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

