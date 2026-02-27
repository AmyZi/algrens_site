'use client';

import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false); // Added for hydration safety
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true); // Signal that we are on the client
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bilar?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { path: '/', label: 'HEM' },
    { path: '/bilar', label: 'VÅRA BILAR' },
    { path: '/marken', label: 'MÄRKEN' },
    { path: '/om-oss', label: 'OM OSS' },
  ];

  // Prevent rendering the dynamic parts until mounted to stop the hydration error
  if (!mounted) {
    return null; 
  }

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      style={{ 
        backgroundColor: scrolled ? '#E9D5DA' : 'transparent', // Replaced var with hex for safety
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        padding: scrolled ? '10px 0' : '20px 0',
        borderBottom: scrolled ? '1px solid #E2E8F0' : 'none'
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          href="/" 
          style={{ 
            color: '#000', 
            fontWeight: '900', 
            fontSize: '1.4rem', 
            letterSpacing: '-0.02em' 
          }}
        >
          AHLGRENS<span style={{ color: scrolled ? '#000' : '#4A5759', fontWeight: '300' }}>HUSBILAR</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            {navLinks.map((link) => {
              // Path matching logic to fix the underline issue
              const isActive = link.path === '/' 
                ? pathname === '/' 
                : pathname.startsWith(link.path);

              return (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  href={link.path}
                  style={{ 
                    color: '#000', 
                    fontWeight: '700', 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.15em',
                    margin: '0 15px',
                    padding: '5px 0',
                    borderBottom: isActive ? '2px solid #FFD700' : '2px solid transparent',
                    transition: 'border-bottom 0.2s ease'
                  }}
                >
                  {link.label}
                </Nav.Link>
              );
            })}

            {/* Kontakt Button */}
            <Nav.Link as={Link} href="/kontakt" className="p-0 ms-lg-4">
              <Button 
                style={{ 
                  backgroundColor: '#FFD700', 
                  color: '#000', 
                  border: 'none',
                  borderRadius: '0',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '12px 30px',
                  letterSpacing: '0.1em',
                }}
              >
                KONTAKTA OSS
              </Button>
            </Nav.Link>

            {/* Search Input */}
            <Form onSubmit={handleSearch} className="ms-lg-3 d-none d-xl-block">
               <input 
                type="text"
                placeholder="SÖK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  backgroundColor: 'transparent',
                  fontSize: '0.7rem',
                  width: '80px',
                  outline: 'none',
                  fontWeight: 'bold'
                }}
               />
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}