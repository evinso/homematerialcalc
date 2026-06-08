export interface Author {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  bio: string;
  avatar: string; // initials for generated avatar
  color: string;  // bg color for avatar
  email: string;
  expertise: string[];
}

export const authors: Record<string, Author> = {
  tom: {
    slug: 'tom',
    name: 'Tom Harrington',
    title: 'Licensed General Contractor',
    credentials: '18 years · Licensed GC · OSHA 30',
    bio: 'Tom has built and renovated over 400 residential projects across the Mid-Atlantic. He specializes in concrete, framing, and exterior hardscape. Tom holds a General Contractor license and OSHA 30 certification, and has managed projects ranging from backyard patios to full foundation pours.',
    avatar: 'TH',
    color: '#2563eb',
    email: 'tom@homematerialcalc.com',
    expertise: ['Concrete', 'Framing', 'Decks', 'Fences', 'Asphalt', 'Pavers', 'Lumber'],
  },
  sarah: {
    slug: 'sarah',
    name: 'Sarah Mitchell',
    title: 'Certified Landscape Designer',
    credentials: 'Certified Horticulturalist · 12 years',
    bio: 'Sarah designs residential landscapes from Portland to Phoenix and writes about mulch, gravel, sod, and low-maintenance planting for US climates. As a Certified Horticulturalist, she has completed over 300 landscape projects and specializes in material selection for different soil types and climate zones.',
    avatar: 'SM',
    color: '#16a34a',
    email: 'sarah@homematerialcalc.com',
    expertise: ['Mulch', 'Gravel', 'Topsoil', 'Sand', 'Sod', 'Grass Seed', 'Landscaping'],
  },
  dan: {
    slug: 'dan',
    name: 'Dan Kowalski',
    title: 'Flooring & Interior Specialist',
    credentials: 'NWFA Certified · 15 years installation',
    bio: 'Dan has installed flooring, tile, and drywall in over 1,200 homes across the Midwest and Southeast. As an NWFA Certified Flooring Inspector, he shares practical installation tips and helps homeowners accurately estimate material quantities to avoid over-buying.',
    avatar: 'DK',
    color: '#9333ea',
    email: 'dan@homematerialcalc.com',
    expertise: ['Flooring', 'Tile', 'Drywall', 'Paint', 'Insulation', 'Lumber'],
  },
  editorial: {
    slug: 'editorial',
    name: 'HomeMaterialCalc Editorial Team',
    title: 'Editorial Staff',
    credentials: 'Reviewed by licensed contractors',
    bio: 'Our editorial team researches and fact-checks material calculations with input from licensed contractors, landscape designers, and certified tradespeople across the US.',
    avatar: 'HC',
    color: '#0891b2',
    email: 'editorial@homematerialcalc.com',
    expertise: ['Material Calculators', 'Home Improvement', 'DIY Projects'],
  },
};

export function getAuthor(slug: string): Author {
  return authors[slug] ?? authors.editorial;
}
