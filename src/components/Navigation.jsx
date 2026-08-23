'use client';

import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import PsaBar from '@/components/PsaBar';

const NAV_LINKS = [
  { path: '/',       label: 'HEM' },
  {
    path: '/bilar',
    label: 'VÅRA BILAR',
    dropdown: [
      { path: '/bilar/nytt',     label: 'Nya husbilar' },
      { path: '/bilar/begagnat', label: 'Begagnade husbilar' },
    ],
  },
  { path: '/marken', label: 'MÄRKEN' },
  { path: '/om-oss', label: 'OM OSS' },
];

export default function Navigation({ announcements = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled]       = useState(false);
  const [expanded, setExpanded]       = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bilar?search=${encodeURIComponent(searchQuery)}`);
      setExpanded(false);
    }
  };

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
  <>
    <Navbar
      expand="lg"
      fixed="top"
      className={`site-nav flex-column w-100 p-0${scrolled ? ' site-nav--scrolled' : ''}`}
    >
      <PsaBar announcements={announcements} />
      <Container className="nav-top-row">

        <Navbar.Brand as={Link} href="/" className="nav-brand">
          AHLGRENS
          <span className={scrolled ? 'nav-brand__sub--dark' : 'nav-brand__sub'}>
            HUSBILAR
          </span>
        </Navbar.Brand>

        {/* Opens the panel — no longer needs to morph, the panel has its own X */}
        <button
          type="button"
          className="nav-burger d-lg-none"
          aria-label="Öppna meny"
          aria-expanded={expanded}
          aria-controls="main-navbar"
          onClick={() => setExpanded(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <Nav className="ms-auto align-items-center d-none d-lg-flex">
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
      </Container>
    </Navbar>

    {/* Self-contained mobile overlay — its own header scrolls with its own content */}
    <div
      id="main-navbar"
      className={`nav-mobile-panel${expanded ? ' nav-mobile-panel--open' : ''}`}
    >
      <div className="nav-mobile-header">
        <Link
          href="/"
          className="nav-brand nav-brand--panel"
          onClick={() => setExpanded(false)}
        >
          AHLGRENS
          <span className="nav-brand__sub">HUSBILAR</span>
        </Link>

        <button
          type="button"
          className="nav-close"
          aria-label="Stäng meny"
          onClick={() => setExpanded(false)}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="nav-mobile-list">
        {NAV_LINKS.map((link) => (
          <div key={link.path} className="nav-mobile-group">
            <Link
              href={link.path}
              className={`nav-mobile-link${isActive(link.path) ? ' nav-mobile-link--active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              {link.label}
            </Link>

            {link.dropdown && (
              <ul className="nav-mobile-sublist">
                {link.dropdown.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="nav-mobile-sublink"
                      onClick={() => setExpanded(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <Link
          href="/kontakt"
          className="nav-mobile-link nav-mobile-link--cta"
          onClick={() => setExpanded(false)}
        >
          KONTAKTA OSS
        </Link>

        <Form onSubmit={handleSearch} className="nav-mobile-search">
          <input
            type="text"
            placeholder="SÖK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search"
            aria-label="Sök bilar"
          />
        </Form>
      </div>
    </div>
  </>
);
}