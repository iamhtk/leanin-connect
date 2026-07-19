/**
 * Curated Unsplash images for Lean In Connect.
 * Theme: women at work, community, leadership, learning, careers.
 */

const u = (id: string, w = 900, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const COVER_IMAGES = {
  womenCommunity: u('photo-1529156069898-49953e39b3ac', 1200, 500),
  womenLaughing: u('photo-1491438590914-bc09fcaaf77a', 900, 500),
  womenMeeting: u('photo-1573164574572-cb89e39749b4', 900, 500),
  womenCollaborating: u('photo-1522202176988-66273c2fd55f', 900, 500),
  womenOffice: u('photo-1600880292203-757bb62b4baf', 900, 500),
  womenPresentation: u('photo-1551836022-d5d88e9218df', 900, 500),
  womenMentorship: u('photo-1573497019940-1c28c88b4f3e', 900, 500),
  womenLaptop: u('photo-1517245386807-bb43f82c33c4', 900, 500),
  womenTeam: u('photo-1542744173-8e7e53415bb0', 900, 500),
  womenWorkshop: u('photo-1556761175-b413da4baf72', 900, 500),
  womenNetworking: u('photo-1515169067868-5387ec356754', 900, 500),
  womenCafe: u('photo-1521737711867-e3b97375f902', 900, 500),
  womenWriting: u('photo-1454165804606-c3d57bc86b40', 900, 500),
  womenLeadership: u('photo-1557804506-669a67965ba0', 900, 500),
  womenConference: u('photo-1475721027785-f74eccf877e2', 900, 500),
  womenCoding: u('photo-1516321318423-f06f85e504b3', 900, 500),
  womenFinance: u('photo-1554224155-6726b3ff858f', 900, 500),
  womenBalance: u('photo-1486312338219-ce68d2c6f44d', 900, 500),
  womenEarlyCareer: u('photo-1523240795612-9a054b0db644', 900, 500),
  womenCity: u('photo-1449824913935-59a10b8d2000', 900, 500),
  womenLondon: u('photo-1513635269975-59663e0ac1ad', 900, 500),
  womenNyc: u('photo-1496442226666-8d4d0e62e6e9', 900, 500),
  womenSingapore: u('photo-1525625293386-3f8f99389edd', 900, 500),
  womenIndia: u('photo-1524492412937-b28074a5d7da', 900, 500),
  womenEvent: u('photo-1515187029135-18ee286d815b', 900, 500),
  womenPanel: u('photo-1591115765373-5207764f72e7', 900, 500),
  womenVirtual: u('photo-1600880292089-90a7e086ee0c', 900, 500),
  bookLearning: u('photo-1507842217343-583bb7270b66', 900, 500),
  notebookDesk: u('photo-1434030216411-0b793f4b4173', 900, 500),
  deskWork: u('photo-1497366216548-37526070297c', 900, 500),
  handshake: u('photo-1521791136064-7986c2920216', 900, 500),
  celebration: u('photo-1517245386807-bb43f82c33c4', 900, 500),
  negotiation: u('photo-1556761175-4b46a572b786', 900, 500),
  promotions: u('photo-1557804506-669a67965ba0', 900, 500),
  biasAtWork: u('photo-1573164574572-cb89e39749b4', 900, 500),
  careerPivots: u('photo-1521737711867-e3b97375f902', 900, 500),
  mentorship: u('photo-1573497019940-1c28c88b4f3e', 900, 500),
  earlyCareer: u('photo-1523240795612-9a054b0db644', 900, 500),
  topicDefault: u('photo-1522202176988-66273c2fd55f', 900, 500),
  portrait1: u('photo-1573496359142-b8d87734a5a2', 400, 400),
  portrait2: u('photo-1580489944761-15a19d654956', 400, 400),
  portrait3: u('photo-1594744803329-e58b31de8bf5', 400, 400),
  portrait4: u('photo-1551836022-d5d88e9218df', 400, 400),
  portrait5: u('photo-1560250097-0b93528c311a', 400, 400),
  portrait6: u('photo-1573497019236-17f8177b81e8', 400, 400),
  portrait7: u('photo-1587614382346-4ec70e388b28', 400, 400),
  portrait8: u('photo-1508214751196-bcfd4ca60f91', 400, 400),
  portrait9: u('photo-1534528741775-53994a69daeb', 400, 400),
  portrait10: u('photo-1531746020798-e6953c6e8e04', 400, 400),
  portrait11: u('photo-1544005313-94ddf0286df2', 400, 400),
  portrait12: u('photo-1438761681033-6461ffad8d80', 400, 400),
  companyOffice: u('photo-1497366754035-f200968a6e72', 200, 200),
  companyDesign: u('photo-1561070791-2526d30994b5', 200, 200),
  companyTech: u('photo-1519389950473-47ba0277781c', 200, 200),
  companyStartup: u('photo-1556761175-5973dc0f32e7', 200, 200),
  profileCover: u('photo-1497366811353-6870744d04b2', 1400, 400),
} as const

export type CoverImageKey = keyof typeof COVER_IMAGES

const PORTRAIT_KEYS: CoverImageKey[] = [
  'portrait1',
  'portrait2',
  'portrait3',
  'portrait4',
  'portrait5',
  'portrait6',
  'portrait7',
  'portrait8',
  'portrait9',
  'portrait10',
  'portrait11',
  'portrait12',
]

/** Deterministic Unsplash portrait for any person seed (name, id, initials). */
export function getPortraitUrl(seed: string): string {
  const source = seed.trim() || 'member'
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash + source.charCodeAt(index) * (index + 1)) % 997
  }
  return COVER_IMAGES[PORTRAIT_KEYS[hash % PORTRAIT_KEYS.length]]
}

const TOPIC_COVER_MAP: Record<string, CoverImageKey> = {
  Negotiation: 'negotiation',
  Promotions: 'promotions',
  'Bias at Work': 'biasAtWork',
  'Work-Life Balance': 'womenBalance',
  'Career Pivots': 'careerPivots',
  Mentorship: 'mentorship',
  Leadership: 'womenLeadership',
  'Early Career': 'earlyCareer',
}

/** Deterministic topic → cover image for feed posts without stored media. */
export function getTopicCoverUrl(topicTag: string, seed?: string): string {
  const mapped = TOPIC_COVER_MAP[topicTag]
  if (mapped) return COVER_IMAGES[mapped]

  const pool: CoverImageKey[] = [
    'womenCollaborating',
    'womenOffice',
    'womenTeam',
    'womenCafe',
    'womenWorkshop',
    'womenLaptop',
    'womenNetworking',
    'topicDefault',
  ]
  const source = seed ?? topicTag
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash + source.charCodeAt(index) * (index + 1)) % 997
  }
  return COVER_IMAGES[pool[hash % pool.length]]
}

/** Show an image on roughly every other post for visual rhythm. */
export function shouldShowPostCover(postId: string): boolean {
  let hash = 0
  for (let index = 0; index < postId.length; index += 1) {
    hash = (hash + postId.charCodeAt(index) * (index + 3)) % 100
  }
  return hash % 2 === 0
}
