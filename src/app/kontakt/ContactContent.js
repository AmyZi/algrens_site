'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ContactContent = () => {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // GOOGLE MAPS CONFIG
  const location = 'Ahlgrens Husbilar, Gånghestersvägen 129, 507 62 Borås, Sweden';
  // Use the Embed API format for iframes
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const form = e.target;
    const formData = new FormData(form);

    // IMPORTANT: Replace 'YOUR_NUMERIC_ID' with the number from your WP admin URL
    const WP_FORM_ID = '8aabf00'; 
    const endpoint = `https://ahlgrens.eu/web/wp-json/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'mail_sent') {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        console.error('WP Validation Error:', data);
      }
    } catch (err) {
      setStatus('error');
      console.error('Submission Error:', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '60px 0' }}>
      <Container>
        <h1 className="fw-bold mb-5" style={{ fontSize: '2.2rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
          Contact Us
        </h1>
        
        <Row className="g-5">
          <Col lg={6}>
            <div className="bg-white p-5 rounded-4 h-100 shadow-sm border border-light">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.75rem' }}>Get in Touch</h2>
              <p className="text-muted mb-5" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                Have a question or want to work together? We'd love to hear from you.
              </p>

              <ContactItem icon={<EmailIcon />} label="Email" value="jonas@ahlgrens.eu" />
              <ContactItem icon={<PhoneIcon />} label="Phone" value="033-10 30 11" />
              <ContactItem icon={<MapIcon />} label="Address" value="Gånghestersvägen 129, 507 62 Borås" />
              <ContactItem icon={<ClockIcon />} label="Business Hours" value="Monday - Friday: 9:00 AM - 5:00 PM" />

              <div className="mt-5">
                <h6 className="fw-bold text-uppercase small mb-3" style={{ color: '#64748B', letterSpacing: '0.1em' }}>Follow Us</h6>
                <div className="d-flex gap-3">
                   <SocialIcon icon={<FacebookIcon />} link="https://www.facebook.com/share/14M7UYf2jR3/?mibextid=wwXIfr" />
                   <SocialIcon icon={<InstagramIcon />} link="https://www.instagram.com/ahlgrenshusbilar?igsh=dWl1NWY3NWJnMnBh" />
                </div>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="bg-white p-5 rounded-4 h-100 shadow-sm border border-light">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.75rem' }}>Send us a Message</h2>
              
              {status === 'success' ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem' }}>✅</div>
                  <h4 className="fw-bold text-success mt-3">Message Sent!</h4>
                  <p className="text-muted">We will contact you shortly.</p>
                  <Button variant="outline-dark" size="sm" onClick={() => setStatus('idle')}>Send another</Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Name</Form.Label>
                    <Form.Control name="your-name" type="text" placeholder="Your name" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Email</Form.Label>
                    <Form.Control name="your-email" type="email" placeholder="your.email@example.com" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-dark">Subject</Form.Label>
                    <Form.Control name="your-subject" type="text" placeholder="How can we help?" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-dark">Message</Form.Label>
                    <Form.Control name="your-message" as="textarea" rows={4} placeholder="Tell us more about your inquiry..." style={inputStyle} required />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-100 border-0 py-3 fw-bold" 
                    style={{ backgroundColor: '#020617', borderRadius: '8px', color: 'white' }}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  {status === 'error' && (
                    <p className="text-danger small mt-3">Something went wrong. Please check your connection or try again later.</p>
                  )}
                </Form>
              )}
            </div>
          </Col>
        </Row>

        <div className="mt-5 rounded-4 overflow-hidden shadow-lg border border-light" style={{ height: '450px' }}>
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Office Location"
          />
        </div>
      </Container>
    </div>
  );
};