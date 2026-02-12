'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ContactContent = () => {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const location = 'Ahlgrens Husbilar, Gånghestersvägen 129, 507 62 Borås, Sweden';
  
  // FIXED: Corrected the ${} syntax for the API key
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const form = e.target;
    const formData = new FormData(form);


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
        console.error('Validation failed:', data);
      }
    } catch (error) {
      setStatus('error');
      console.error('Submission error:', error);
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
                Have a question? We'd love to hear from you. 
              </p>

              <ContactItem icon={<EmailIcon />} label="Email" value="jonas@ahlgrens.eu" />
              <ContactItem icon={<PhoneIcon />} label="Phone" value="033-10 30 11" />
              <ContactItem icon={<MapIcon />} label="Address" value="Gånghestersvägen 129, 507 62 Borås" />
              <ContactItem icon={<ClockIcon />} label="Business Hours" value="Mon - Fri: 9:00 - 17:00" />
            </div>
          </Col>

          <Col lg={6}>
            <div className="bg-white p-5 rounded-4 h-100 shadow-sm border border-light">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.75rem' }}>Send us a Message</h2>

              {status === 'success' ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem' }}>✅</div>
                  <h4 className="fw-bold text-success mt-3">Message Sent!</h4>
                  <Button variant="outline-dark" className="mt-3" onClick={() => setStatus('idle')}>Send another</Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {/* IMPORTANT: 'name' attributes added to match Contact Form 7 tags */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Name</Form.Label>
                    <Form.Control name="your-name" type="text" placeholder="Your name" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Email</Form.Label>
                    <Form.Control name="your-email" type="email" placeholder="email@example.com" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Subject</Form.Label>
                    <Form.Control name="your-subject" type="text" placeholder="Subject" style={inputStyle} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">Message</Form.Label>
                    <Form.Control name="your-message" as="textarea" rows={4} style={inputStyle} required />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 border-0 py-3 fw-bold" 
                    disabled={status === 'loading'}
                    style={{ backgroundColor: '#020617', borderRadius: '8px', color: 'white' }}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </Button>
                  {status === 'error' && <p className="text-danger mt-2">Error sending message. Try again.</p>}
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

// --- Sub Components & Icons (Keep these exactly as they are) ---
const ContactItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center mb-4">
    <div style={{ width: '48px', height: '48px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', color: '#2563EB' }}>
      {icon}
    </div>
    <div>
      <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{label}</div>
      <div className="text-muted" style={{ fontSize: '0.9rem' }}>{value}</div>
    </div>
  </div>
);

const SocialIcon = ({ icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', backgroundColor: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', color: '#0F172A', textDecoration: 'none' }}>
    {icon}
  </a>
);

const inputStyle = { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px' };

const FacebookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const InstagramIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const EmailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default ContactContent;