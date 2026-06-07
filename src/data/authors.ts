export interface Author {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  bio: string;
  avatar: string; // initials for generated avatar
  color: string;  // bg color for avatar
}

export const authors: Record<string, Author> = {
  tom: {
    slug: 'tom',
    name: 'Tom Harrington',
    title: 'Licensed General Contractor',
    credentials: '18 years · Licensed GC · OSHA 30',
    bio: 'Tom has built and renovated over 400 residential projects across the Mid-Atlantic. He specializes in concrete, framing, and exterior hardscape.',
    avatar: 'TH',
    color: '#2563eb',
  },
  sarah: {
    slug: 'sarah',
    name: 'Sarah Mitchell',
    title: 'Landscape Designer',
    credentials: 'Certified Horticulturalist · 12 years',
    bio: 'Sarah designs residential landscapes from Portland to Phoenix and writes about mulch, gravel, sod, and low-maintenance planting for US climates.',
    avatar: 'SM',
    color: '#16a34a',
  },
  dan: {
    slug: 'dan',
    name: 'Dan Kowalski',
    title: 'Flooring & Interior Specialist',
    credentials: 'NWFA Certified · 15 years installation',
    bio: 'Dan has installed flooring, tile, and drywall in over 1,200 homes. He shares practical installation tips and helps homeowners buy the right amount of material.',
    avatar: 'DK',
    color: '#9333ea',
  },
  editorial: {
    slug: 'editorial',
    name: 'HomeMaterialCalc Editorial Team',
    title: 'Editorial Staff',
    credentials: 'Reviewed by licensed contractors',
    bio: 'Our editorial team researches and fact-checks material calculations with input from licensed contractors, landscape designers, and certified tradespeople across the US.',
    avatar: 'HC',
    color: '#0891b2',
  },
};

export function getAuthor(slug: string): Author {
  return authors[slug] ?? authors.editorial;
}
