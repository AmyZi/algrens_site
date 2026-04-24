'use client';

import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site-config';

const NAV_LINKS = [
  { path: '/',       label: 'HEM' },
  {
    path: '/bilar',
    label: 'VÅRA BILAR',
    dropdown: [
      { path: '/bilar/nytt',       label: 'Nya husbilar' },
      { path: '/bilar/begagnat', label: 'Begagnade husbilar' },
    ],
  },
  { path: '/marken', label: 'MÄRKEN' },
  { path: '/om-oss', label: 'OM OSS' },
];

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled]       = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bilar?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`site-nav${scrolled ? ' site-nav--scrolled' : ''}`}
    >
      <Container>

        <Navbar.Brand as={Link} href="/" className="nav-brand">
          AHLGRENS
          <span className={scrolled ? 'nav-brand__sub--dark' : 'nav-brand__sub'}>
            HUSBILAR
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">

            {NAV_LINKS.map((link) => (
              <div key={link.path} className="nav-item-wrap">
                <Link
                  href={link.path}
                  className={`nav-link-item${isActive(link.path) ? ' nav-link-item--active' : ''}`}
                >
                  {link.label}
                  {link.dropdown && <span className="nav-caret" aria-hidden="true">▾</span>}
                </Link>

                {link.dropdown && (
                  <ul className="nav-dropdown">
                    {link.dropdown.map((item) => (
                      <li key={item.path}>
                        <Link href={item.path} className="nav-dropdown-item">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <Nav.Link as={Link} href="/kontakt" className="p-0 ms-lg-4">
              <span className="nav-cta">KONTAKTA OSS</span>
            </Nav.Link>

            <Form onSubmit={handleSearch} className="ms-lg-3 d-none d-xl-flex align-items-center">
              <input
                type="text"
                placeholder="SÖK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search"
                aria-label="Sök bilar"
              />
            </Form>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}