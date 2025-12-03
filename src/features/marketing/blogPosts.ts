export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-driven-gdpr-automation',
    title: 'AI-driven GDPR automation for modern teams',
    summary: 'How AURA-GDPR uses AI to draft policies, surface risks, and streamline audits.',
    date: '2025-02-01',
  },
  {
    slug: 'building-a-dsr-center-of-excellence',
    title: 'Building a DSR center of excellence',
    summary: 'Best practices to handle data subject requests with repeatable workflows and SLAs.',
    date: '2025-01-20',
  },
  {
    slug: 'multi-tenant-privacy-at-scale',
    title: 'Multi-tenant privacy at scale',
    summary: 'Why MSPs and multi-brand companies choose AURA-GDPR for isolated tenants.',
    date: '2025-01-05',
  },
];
