export interface ResearchStat {
    id: string
    stat: string
    source: string
    topic: string
    insight: string
    questions: string[]
  }
  
  export const RESEARCH_STATS: ResearchStat[] = [
    {
      id: '1',
      stat: 'Women who negotiate their salary earn 18% more over 5 years than those who do not.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Negotiation',
      insight: 'The pay gap is partly a negotiation gap. Women who ask close it significantly.',
      questions: [
        'What data did you use when you last negotiated?',
        'What holds you back from asking for more?',
        'Who taught you how to negotiate?',
      ],
    },
    {
      id: '2',
      stat: 'Only 93 women are promoted to manager for every 100 men — the broken rung.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Promotions',
      insight: 'The biggest barrier is not the glass ceiling. It is the first step up.',
      questions: [
        'What was the most important factor in your first promotion?',
        'Has anyone ever advocated for you in a promotion conversation?',
        'What would make the promotion process feel more fair?',
      ],
    },
    {
      id: '3',
      stat: 'Women are 1.5x more likely than men to have experienced microaggressions at work.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Bias at Work',
      insight: 'Subtle bias is still bias. And it compounds.',
      questions: [
        'How do you respond in the moment when bias shows up?',
        'What support do you wish you had when dealing with bias?',
        'Have you ever called out bias at work? What happened?',
      ],
    },
    {
      id: '4',
      stat: 'Women with sponsors are 22% more likely to ask for stretch assignments.',
      source: 'Lean In Women in the Workplace 2024',
      topic: 'Mentorship',
      insight: 'Mentors advise. Sponsors advocate. Both matter.',
      questions: [
        'Do you have a sponsor, not just a mentor?',
        'How did you find your most valuable mentor?',
        'What would you tell someone who wants to find a sponsor?',
      ],
    },
    {
      id: '5',
      stat: 'Women who participate in Lean In Circles are 2x as likely to receive a promotion.',
      source: 'Lean In Internal Research 2025',
      topic: 'Leadership',
      insight: 'Community is not soft. It is a career accelerator.',
      questions: [
        'What has your community done for your career?',
        'How do you show up for other women at work?',
        'What would you want a Circle to help you work through right now?',
      ],
    },
    {
      id: '6',
      stat: 'Only 29% of C-suite roles are held by women, despite women earning 59% of college degrees.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Leadership',
      insight: 'Credentials are not the gap. Opportunity is.',
      questions: [
        'What has been the biggest structural barrier in your career?',
        'Who opened the most important door for you?',
        'What would change if leadership were more representative?',
      ],
    },
    {
      id: '7',
      stat: 'Women are 2x more likely to be mistaken for someone more junior than they are.',
      source: 'Lean In Women in the Workplace 2024',
      topic: 'Bias at Work',
      insight: 'Being underestimated is exhausting. And it is very common.',
      questions: [
        'How do you establish credibility in a new room?',
        'What strategies have helped you be taken seriously?',
        'How do you support colleagues who are being underestimated?',
      ],
    },
    {
      id: '8',
      stat: 'Remote and hybrid work has improved work-life balance for 72% of women.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Work-Life Balance',
      insight: 'Flexibility is not a perk. For many women, it is the difference.',
      questions: [
        'How has your relationship with work changed in the last few years?',
        'What boundaries have you set that actually worked?',
        'What does a sustainable career look like to you?',
      ],
    },
    {
      id: '9',
      stat: 'Women who self-promote effectively are promoted 30% faster than those who do not.',
      source: 'Lean In Research 2024',
      topic: 'Promotions',
      insight: 'Visibility is a skill. And it can be learned.',
      questions: [
        'What is your approach to making your work visible?',
        'Has self-promotion ever felt uncomfortable? What helped?',
        'Who taught you to advocate for yourself at work?',
      ],
    },
    {
      id: '10',
      stat: 'Early-career women are 40% more likely to leave their company if they lack a mentor.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Early Career',
      insight: 'The first five years set the trajectory. Connection matters most then.',
      questions: [
        'What do you wish someone had told you at the start of your career?',
        'Who had the biggest impact on your early professional years?',
        'What would you tell a woman just starting out today?',
      ],
    },
    {
      id: '11',
      stat: 'Women who negotiate job offers receive 7-10% higher starting salaries on average.',
      source: 'Lean In Salary Research 2025',
      topic: 'Negotiation',
      insight: 'The offer is a starting point. Not a final answer.',
      questions: [
        'Did you negotiate your current role? What happened?',
        'What information gave you the most confidence to negotiate?',
        'What would help more women feel ready to negotiate?',
      ],
    },
    {
      id: '12',
      stat: 'Companies in the top quartile for gender diversity are 15% more likely to outperform.',
      source: 'McKinsey via Lean In Women in the Workplace 2025',
      topic: 'Leadership',
      insight: 'Diversity is not charity. It is competitive advantage.',
      questions: [
        'How do you advocate for diversity at your company?',
        'What does inclusive leadership look like to you?',
        'What change would make the biggest difference at your organization?',
      ],
    },
    {
      id: '13',
      stat: '74 women of color are promoted to manager for every 100 men.',
      source: 'Lean In Women in the Workplace 2025',
      topic: 'Bias at Work',
      insight: 'The broken rung is even more broken for women of color.',
      questions: [
        'How does race intersect with your experience at work?',
        'What allyship has actually made a difference for you?',
        'What needs to change at the structural level?',
      ],
    },
    {
      id: '14',
      stat: 'Women who take career pivots report higher job satisfaction within 2 years.',
      source: 'Lean In Research 2024',
      topic: 'Career Pivots',
      insight: 'The pivot is scary. The regret of not pivoting is worse.',
      questions: [
        'What made you take or consider a major career change?',
        'What held you back, and what finally pushed you forward?',
        'What would you tell someone who is afraid to make a pivot?',
      ],
    },
    {
      id: '15',
      stat: 'Women in Circles are 71% more likely to say they have the support they need to advance.',
      source: 'Lean In Internal Research 2025',
      topic: 'Mentorship',
      insight: 'Support does not happen by accident. It happens in community.',
      questions: [
        'Where do you find your most meaningful professional support?',
        'How have you supported another woman\'s career this year?',
        'What kind of community do you wish existed for you right now?',
      ],
    },
  ]