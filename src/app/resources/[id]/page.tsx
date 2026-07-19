'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Clock, User, Sparkles, Loader2 } from 'lucide-react'
import { COVER_IMAGES } from '@/lib/cover-images'
import { CoverImage } from '@/components/atoms/CoverImage'

const RESOURCE_DETAILS: Record<string, {
  id: number, type: string, title: string,
  author: string, readTime: string, color: string, cover_url: string, content: string
}> = {
  '1': {
    id:1, type:'Workshop', title:'Your first Circle meeting',
    author:'Lean In', readTime:'5 min', color:'#7B2335',
    cover_url: COVER_IMAGES.womenWorkshop,
    content:`Starting strong sets the tone for everything that follows. Your first Circle meeting is about one thing: connection.

Introductions (20 minutes)
Go around the room. Each person shares their name, what they do, and one thing they are hoping to get from this Circle. Keep it to 2 minutes per person.

The why (10 minutes)
Share why you started or joined this Circle. Be honest. The more vulnerable you are as the leader, the more permission others have to be real too.

Agreements (15 minutes)
What makes this a safe space? Co-create 3 to 5 agreements as a group. Common ones: what is shared here stays here, we make space for everyone to speak, we come prepared.

First topic preview (10 minutes)
Share what you will discuss next month. Give everyone a chance to start thinking about it.

Close (5 minutes)
Check out: one word for how you feel leaving this meeting.

The magic is not in the agenda. It is in the room. Trust the group.`
  },
  '3': {
    id:3, type:'Video', title:'How to negotiate so everyone wins',
    author:'Sara Chen', readTime:'8 min', color:'#065F46',
    cover_url: COVER_IMAGES.bookLearning,
    content:`Negotiation is not a battle. It is a conversation about value.

The three things you need before any negotiation:

Your number
Know the exact number you want. Not a range. A number. Research Levels.fyi, LinkedIn Salary, and Glassdoor for your role, level, and location.

Your value narrative
Write down three specific things you have accomplished in the last 12 months with measurable outcomes. These are your proof points.

Your BATNA
Best Alternative to a Negotiated Agreement. What will you do if they say no? If your answer is nothing, your leverage is low.

The actual conversation
After they give you the number, pause. Then say: "Thank you. I was hoping we could get to X. Is there flexibility there?" Then stop talking. Let them respond.

If they push back
"I understand. Can you help me understand what would need to be true for us to get to X?"

You are not being difficult. You are being professional.`
  },
  '6': {
    id:6, type:'Toolkit', title:'Negotiation prep template',
    author:'Sara Chen', readTime:'4 min', color:'#1A6B3C',
    cover_url: COVER_IMAGES.deskWork,
    content:`Use this template before every salary or scope negotiation.

My target number
The number I am asking for: ___
My research sources: ___
Market rate for my role: ___

My value proof points
Achievement 1 with measurable outcome: ___
Achievement 2 with measurable outcome: ___
Achievement 3 with measurable outcome: ___

My opening script
"Thank you for the offer. I am genuinely excited about this role. Based on my research and the value I bring, I was hoping we could get to [number]. Is there flexibility there?"

Their likely objections
Objection: "That is above our budget."
Response: "I understand. What would need to be true for us to get there?"

Objection: "We have a set pay band."
Response: "Is there flexibility on signing bonus or equity to bridge the gap?"

My BATNA
If they say no, I will: ___
My walk-away number: ___`
  },
  '4': {
    id:4, type:'Article', title:'Make stress work for you',
    author:'Diane Kasprowicz', readTime:'4 min', color:'#B45309',
    cover_url: COVER_IMAGES.womenPresentation,
    content:`Your mindset shapes stress. The latest research shows that stress itself is not harmful. How you think about stress determines its impact.

The reframe
When you feel stressed, your body is mobilizing energy. Your heart is beating faster not to hurt you, but to prepare you. That is your body working for you, not against you.

Three ways to make stress work for you:

Name it
When you notice stress, say out loud: "I am excited." The physiological response to excitement and stress is identical. The label changes the experience.

Find the meaning
Stress follows things you care about. If you are stressed about a presentation, it is because the outcome matters to you. Let the stress remind you of your investment, not undermine it.

Connect it to others
Research shows that when we view stress as something that helps us rise to meet challenges for the benefit of others, the negative health effects disappear. Who are you doing this for?

You do not need to eliminate stress. You need to change your relationship with it.`
  },
  '5': {
    id:5, type:'Video', title:'Why stories beat data at work',
    author:'Aisha Patel', readTime:'7 min', color:'#6B21A8',
    cover_url: COVER_IMAGES.womenWriting,
    content:`Data convinces minds. Stories move people.

The research is clear: people remember stories up to 22 times more than facts alone. If you want your ideas to stick, you need to tell a story.

The four elements of a story that works:

A specific person
Not "women in the workplace" but "Sarah, a senior engineer I met last year." Specificity creates empathy. Abstract statements create distance.

A real problem
The tension has to feel genuine. What was at stake? What could go wrong? Without conflict, there is no story.

A turning point
Something changed. A decision was made, a lesson was learned, a door was opened. The turning point is where the meaning lives.

A clear outcome
What happened because of the story? What should the listener do differently now?

How to use this at work:

Before your next presentation, find one story that illustrates your key point. Tell the story first. Then show the data. The data will land differently because the audience already cares.

The most persuasive people in any room are not the ones with the most data. They are the ones who make you feel something first.`
  },
  '2': {
    id:2, type:'Article', title:'Lean In Connect FAQs',
    author:'Lean In Team', readTime:'4 min', color:'#1E4A8C',
    cover_url: COVER_IMAGES.notebookDesk,
    content:`Everything you need to know about Lean In Connect.

What is Lean In Connect?
Lean In Connect is a community platform for women to share experiences, ask for advice, join Circles, and access leadership resources. It is the digital home of the Lean In community.

How do Circles work?
Circles are small groups of 5 to 10 women who meet regularly, usually once a month, to support each other. You can join an existing Circle or start your own. Circle members follow a research-backed curriculum together.

What is the difference between Circles, Networks, and Groups?
Circles are small, intimate, and meet regularly. Networks are larger regional or industry communities. Groups are public discussion forums open to everyone.

How do I find my community?
Use the search bar to find Circles, Networks, or members in your area or industry. You can also filter by topic to find discussions that matter to you.

Is my information private?
Your profile is private by default. You control what you share and with whom. Go to Settings to manage your privacy preferences.

How do I get the most out of Connect?
Join a Circle, post in the feed, follow people doing interesting work, and attend events. The more you put in, the more you get back.`
  },
  '7': {
    id:7, type:'Article', title:'Managing up when your manager changes',
    author:'Aisha Patel', readTime:'7 min', color:'#7B2335',
    cover_url: COVER_IMAGES.womenMentorship,
    content:`The first 30 days under a new manager set the tone for the next 18 months.

What most people do wrong
They wait. They assume the new manager will come to them, figure out what they do, and recognize their value. This rarely happens fast enough.

What to do instead:

Request a 1:1 in the first week
Do not wait to be invited. Send a calendar invite. Say: "I would love 30 minutes to introduce myself and share what I am working on."

Bring a one-pager
Before that meeting, write one page covering: what you own, what you have accomplished in the last 6 months with outcomes, what you are working on now, and what you need from your manager to do your best work.

Ask the questions no one asks
"What does success look like for you in this role over the next 90 days?" and "What do you wish you had known in your first week here?" These questions signal that you think strategically.

Do not assume they know your wins
Your previous manager knew your context. Your new manager does not. Every outcome you share is new information. Be generous with it.

The goal of the first 30 days is not to impress. It is to establish trust. Trust comes from consistency, clarity, and follow-through. Do what you say you will do.`
  },
  '8': {
    id:8, type:'Article', title:'5 ways to fight burnout at work',
    author:'Priya Sharma', readTime:'6 min', color:'#0F4C81',
    cover_url: COVER_IMAGES.womenLeadership,
    content:`Burnout is not a character flaw. It is a system problem. But while systems change slowly, you need strategies that work now.

Five things that actually help:

1. Name what is draining you specifically
Burnout is not one feeling. It is usually a combination of exhaustion, cynicism, and feeling ineffective. Which one is loudest for you right now? The answer changes what you do next.

2. Protect one thing every day
Not a whole morning. Not a whole weekend. One thing. A walk at lunch. The first hour of your day for deep work. One meeting you decline. Start with one.

3. Talk to someone who is not in the problem
When we are burned out, we tend to stay inside the system that is burning us out. A friend outside your company, a mentor, a Circle member. Someone who can see you from outside the fishbowl.

4. Separate your identity from your output
Burnout accelerates when we believe our worth is our productivity. It is not. You are not your deliverables. This is a practice, not a realization.

5. Make one structural change
Rest helps in the short term. A structural change is what prevents recurrence. That might mean a conversation with your manager, dropping a project, or resetting a boundary that has slowly dissolved.

You cannot perform your way out of burnout. You have to change something.`
  },
  '9': {
    id:9, type:'Podcast', title:'How to lead with data and courage',
    author:'Jennifer Park', readTime:'32 min', color:'#065F46',
    cover_url: COVER_IMAGES.womenLaptop,
    content:`Leadership is not a personality type. It is a practice.

From the conversation with Google's former VP of People Operations:

On data-driven leadership
Most leaders use data to confirm what they already believe. The best leaders use data to challenge their assumptions. The question is not "does this data support my position?" It is "what is this data telling me that I did not expect?"

On psychological safety
Teams with psychological safety do not agree more. They disagree more productively. People raise problems early instead of hiding them. They experiment instead of defaulting to what worked before.

On feedback cultures
The hardest feedback to give is not negative feedback. It is honest positive feedback. We underinvest in telling people specifically what they do well. This matters because people cannot replicate what they do not know they are doing.

On women in leadership
The data consistently shows that companies with gender-diverse leadership outperform those without. The question is not whether diversity improves performance. The data is clear. The question is why so many organizations still act like it is debatable.

On the courage part
You can have all the data in the world and still not make the hard call. Data gives you cover. Courage gives you the decision. The best leaders need both.`
  },
}

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const resource = RESOURCE_DETAILS[id]
  const [aiSummary, setAiSummary] = useState('')
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [hasSummary, setHasSummary] = useState(false)

  const generateSummary = async () => {
    if (!resource) return
    setIsLoadingSummary(true)
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Summarize the key takeaways from this resource titled "${resource.title}" in exactly 3 bullet points starting with a bullet character. Content: ${resource.content.slice(0, 600)}. Keep each point under 20 words. Focus on what someone should do differently after reading this.`,
          history: [],
        }),
      })
      const data = (await res.json()) as { data?: string }
      if (data.data) {
        setAiSummary(data.data)
        setHasSummary(true)
      }
    } catch {
      // silent
    } finally {
      setIsLoadingSummary(false)
    }
  }

  if (!resource) {
    return (
      <div style={{padding:'48px 32px',textAlign:'center'}}>
        <p style={{color:'var(--color-text-muted)',fontSize:'15px'}}>
          Resource not found.
        </p>
        <button onClick={() => router.push('/resources')}
          style={{
            marginTop:'16px',color:'var(--color-brand)',
            background:'none',border:'none',cursor:'pointer',
            fontSize:'14px',fontFamily:'inherit'
          }}>
          Back to Resources
        </button>
      </div>
    )
  }

  return (
    <main aria-label={resource.title} 
      style={{padding:'24px 32px 48px',maxWidth:'720px'}}>

      <button
        onClick={() => router.push('/resources')}
        aria-label="Back to Resources"
        style={{
          display:'flex',alignItems:'center',gap:'6px',
          background:'none',border:'none',cursor:'pointer',
          color:'var(--color-text-muted)',fontSize:'13px',
          marginBottom:'20px',fontFamily:'inherit',padding:'0'
        }}>
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Resources
      </button>

      <div style={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <CoverImage
          src={resource.cover_url}
          alt={resource.title}
          height={200}
          overlayOpacity={0.55}
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          zIndex: 1,
        }}>
          <span style={{
            fontSize:'10px',fontWeight:'700',letterSpacing:'0.1em',
            textTransform:'uppercase',color:'rgba(255,255,255,0.8)',
            background:'rgba(255,255,255,0.2)',padding:'3px 10px',
            borderRadius:'9999px',
            alignSelf: 'flex-start',
          }}>
            {resource.type}
          </span>
          <h1 style={{
            fontSize:'22px',fontWeight:'700',color:'white',
            marginTop:'10px',lineHeight:'1.3'
          }}>
            {resource.title}
          </h1>
          <div style={{display:'flex',gap:'16px',marginTop:'12px'}}>
            <span style={{
              display:'flex',alignItems:'center',gap:'5px',
              color:'rgba(255,255,255,0.8)',fontSize:'13px'
            }}>
              <User size={13} aria-hidden="true" />
              {resource.author}
            </span>
            <span style={{
              display:'flex',alignItems:'center',gap:'5px',
              color:'rgba(255,255,255,0.8)',fontSize:'13px'
            }}>
              <Clock size={13} aria-hidden="true" />
              {resource.readTime} read
            </span>
          </div>
        </div>
      </div>

      {!hasSummary && (
        <button
          onClick={generateSummary}
          disabled={isLoadingSummary}
          aria-label="Generate AI summary of key takeaways"
          style={{
            display:'flex',alignItems:'center',gap:'8px',
            background:'var(--color-brand-subtle)',
            border:'1px solid var(--color-border-brand)',
            borderRadius:'10px',padding:'12px 16px',
            marginBottom:'20px',
            cursor: isLoadingSummary ? 'not-allowed' : 'pointer',
            width:'100%',fontFamily:'inherit'
          }}>
          {isLoadingSummary
            ? <Loader2 size={15} style={{
                color:'var(--color-brand)',
                animation:'spin 1s linear infinite'
              }} aria-hidden="true" />
            : <Sparkles size={15} style={{color:'var(--color-brand)'}} 
                aria-hidden="true" />
          }
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:'13px',fontWeight:'600',
              color:'var(--color-brand)'}}>
              {isLoadingSummary 
                ? 'Generating key takeaways...' 
                : 'AI Key Takeaways for your Circle'}
            </div>
            <div style={{fontSize:'12px',color:'var(--color-text-muted)',
              marginTop:'1px'}}>
              Get a quick summary to share with your Circle
            </div>
          </div>
        </button>
      )}

      {hasSummary && aiSummary && (
        <div style={{
          background:'var(--color-brand-subtle)',
          border:'1px solid var(--color-border-brand)',
          borderLeft:'3px solid var(--color-brand)',
          borderRadius:'12px',padding:'16px',marginBottom:'20px'
        }} aria-live="polite">
          <div style={{
            display:'flex',alignItems:'center',gap:'6px',marginBottom:'10px'
          }}>
            <Sparkles size={13} style={{color:'var(--color-brand)'}} 
              aria-hidden="true" />
            <span style={{fontSize:'11px',fontWeight:'600',
              letterSpacing:'0.08em',textTransform:'uppercase',
              color:'var(--color-brand)'}}>
              AI Key Takeaways
            </span>
          </div>
          <p style={{fontSize:'13px',color:'var(--color-text-default)',
            lineHeight:'1.6',whiteSpace:'pre-line'}}>
            {aiSummary}
          </p>
        </div>
      )}

      <article style={{
        fontSize:'15px',color:'var(--color-text-default)',
        lineHeight:'1.7'
      }}>
        {resource.content.split('\n').map((line, i) => {
          if (!line.trim()) {
            return <div key={i} style={{height:'12px'}} />
          }
          const isHeading = line.length < 60 && 
            !line.startsWith('-') && 
            !line.includes(':') &&
            i > 0 &&
            resource.content.split('\n')[i+1] === ''
          if (isHeading) {
            return (
              <h2 key={i} style={{
                fontSize:'17px',fontWeight:'700',
                color:'var(--color-text-default)',
                marginTop:'20px',marginBottom:'4px'
              }}>
                {line}
              </h2>
            )
          }
          return (
            <p key={i} style={{marginBottom:'6px'}}>
              {line}
            </p>
          )
        })}
      </article>
    </main>
  )
}

