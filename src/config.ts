export const SITE = {
  name: 'Wayne Jones, CPA',
  legalName: 'Wayne Jones Accounting Services',
  tagline: "Rome's trusted name in tax & accounting since 2008.",
  phone: '(706) 232-8565',
  phoneHref: 'tel:+17062328565',
  email: '', // PLACEHOLDER: branded email not yet set; contact via form
  street: '101 East 2nd Avenue, Suite 330',
  city: 'Rome', state: 'GA', zip: '30161',
  lat: 34.2570, lng: -85.1647, // approx downtown Rome; PLACEHOLDER: refine
  hours: 'Mon–Fri 9:00 AM – 4:00 PM',
  openingHoursSpec: 'Mo-Fr 09:00-16:00',
  licensedStates: ['Georgia', 'Alabama'],
  cpaLicense: 'CPA026715',
  founded: '2008',
  facebook: 'https://www.facebook.com/p/Wayne-Jones-Accounting-Services-100063056748027/',
  areaServed: ['Rome GA', 'Floyd County GA', 'Cartersville GA', 'Calhoun GA', 'Cedartown GA', 'Northwest Georgia', 'Northeast Alabama'],
  // Phase 1: scheduler not yet connected → CTA routes to the contact page.
  // Phase 2: set to a Calendly/Cal.com/GHL URL to make every CTA real scheduling.
  bookingUrl: '/contact/',
  bookingIsExternal: false,
};

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Tax Tools', href: '/tax-tools/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];
