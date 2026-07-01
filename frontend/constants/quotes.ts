// Local, offline-first quotation library.
// The app works fully without a backend — this is the source of truth for
// reminders. The optional AI backend (see AppContext) can supplement it.

export type QuoteCategory =
  | 'health'
  | 'relationships'
  | 'productivity'
  | 'mindfulness'
  | 'sleep'
  | 'nature'
  | 'family'
  | 'focus'
  | 'creativity'
  | 'growth';

export interface Quote {
  id: string;
  text: string;
  category: QuoteCategory;
}

export interface CategoryMeta {
  key: QuoteCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'health', label: 'Health', icon: 'fitness-outline', color: '#FF6B6B' },
  { key: 'relationships', label: 'Relationships', icon: 'heart-outline', color: '#FF8FB1' },
  { key: 'productivity', label: 'Productivity', icon: 'checkmark-done-outline', color: '#4A90E2' },
  { key: 'mindfulness', label: 'Mindfulness', icon: 'leaf-outline', color: '#4ECDC4' },
  { key: 'sleep', label: 'Sleep', icon: 'moon-outline', color: '#6C5CE7' },
  { key: 'nature', label: 'Nature', icon: 'sunny-outline', color: '#2ECC71' },
  { key: 'family', label: 'Family', icon: 'people-outline', color: '#F39C12' },
  { key: 'focus', label: 'Focus', icon: 'eye-outline', color: '#34495E' },
  { key: 'creativity', label: 'Creativity', icon: 'color-palette-outline', color: '#E67E22' },
  { key: 'growth', label: 'Growth', icon: 'trending-up-outline', color: '#16A085' },
];

const raw: Record<QuoteCategory, string[]> = {
  health: [
    'Your eyes need a break. Look at something 20 feet away for 20 seconds.',
    'Your posture is suffering. Stand up and stretch right now.',
    'Your neck and shoulders will thank you for putting the phone down.',
    'Physical activity boosts your mood better than any scroll ever will.',
    'Drink a glass of water. Your body is asking for attention.',
    'Your spine wasn\'t built to hunch over a screen all day.',
    'A five-minute walk can reset your entire nervous system.',
    'Blue light before bed steals your rest. Give your eyes a break.',
    'Your heart rate drops the moment you stop doom-scrolling.',
    'Stretch your wrists and fingers — they\'ve earned a rest.',
    'Movement is medicine. Take ten steps away from the screen.',
    'Your body keeps score of every hour you sit still.',
    'Fresh air does more for your energy than another feed refresh.',
    'Deep breathing for one minute lowers your stress hormones instantly.',
    'Your future joints will thank you for standing up now.',
  ],
  relationships: [
    'Someone you love might need you right now. Be present.',
    'Face-to-face conversations build deeper connections than any chat app.',
    'Your relationships need quality time, not screen time.',
    'Call someone you miss instead of scrolling past their photo.',
    'Real connection happens in eye contact, not comment sections.',
    'The people in this room deserve your full attention.',
    'A handwritten note means more than a hundred likes.',
    'Listening fully is the rarest gift you can give someone today.',
    'Put the phone down and really see the person across from you.',
    'Your friends remember the moments you were present, not online.',
    'Trust grows in undistracted conversations, not between notifications.',
    'Someone is waiting for you to look up and smile.',
    'A shared laugh in person outlasts a thousand reactions.',
    'Your presence is the best gift you can give someone today.',
  ],
  productivity: [
    'Your productivity increases with focused, uninterrupted time.',
    'Your goals need action, not distraction. Get moving.',
    'One deep work session beats three hours of scattered scrolling.',
    'Close the app. Open the task you\'ve been avoiding.',
    'Every notification you ignore is a decision to protect your day.',
    'Small consistent effort now beats a scramble later.',
    'Your to-do list won\'t finish itself between scrolls.',
    'The best time to start that task was five minutes ago.',
    'Momentum builds when you commit the next ten minutes fully.',
    'Progress feels better than the dopamine hit of another refresh.',
    'Batch your notifications, not your life, into little pieces.',
    'A focused hour is worth more than a distracted day.',
    'Your career grows in the hours you aren\'t scrolling.',
    'Discipline today buys freedom tomorrow. Put the phone down.',
  ],
  mindfulness: [
    'Mindfulness requires disconnection. Try it for just one minute.',
    'Your attention is valuable. Don\'t give it away for free.',
    'Notice your breath. Notice the room. Notice this moment.',
    'Boredom is where your best ideas are hiding. Let it happen.',
    'The present moment is the only one you actually own.',
    'Silence your phone before you silence your own thoughts.',
    'Being fully here, even for a minute, resets your whole day.',
    'Your mind needs quiet to process what it just took in.',
    'Notice five things around you right now, not on a screen.',
    'Awareness starts the second you stop reaching for your phone.',
    'A calm mind can\'t be built on a feed of noise.',
    'Sit with the discomfort of boredom — it passes, and clarity follows.',
    'You can\'t be anxious and fully present at the same time.',
  ],
  sleep: [
    'Sleep quality improves dramatically when screens go off before bed.',
    'Your brain needs downtime to process and restore itself.',
    'Tomorrow\'s energy depends on the phone you put down tonight.',
    'Blue light tricks your brain into thinking it\'s still daytime.',
    'A tired mind scrolls out of habit, not need. Rest instead.',
    'The last hour before bed shapes how well you sleep.',
    'Your dreams are worth more than one more scroll.',
    'Charge your phone outside the bedroom tonight and see the difference.',
    'Deep sleep repairs your body — screens only postpone it.',
    'Read a page of a real book instead of a feed tonight.',
    'Your alarm will feel kinder if you sleep an hour earlier.',
  ],
  nature: [
    'Nature is calling. Go outside and breathe real air.',
    'Sunset won\'t wait for you to finish scrolling. Go watch it.',
    'The sky looks different in person than it does in a photo.',
    'Ten minutes outside can lower stress more than an hour indoors.',
    'Trees don\'t buffer. Go stand under one for a while.',
    'Fresh air clears more mental fog than any app can.',
    'The world outside your window is more interesting than the one in it.',
    'Feel the sun on your skin instead of the glow of your screen.',
    'A short walk outside resets your focus better than a break app.',
    'Birdsong is a notification worth paying attention to.',
  ],
  family: [
    'Your family misses you, even when you\'re in the same room.',
    'Children learn from watching you. Set a good example today.',
    'Family dinners are better without phones on the table.',
    'The kids will remember whether you looked up or looked down.',
    'A shared board game beats a shared feed every time.',
    'Your parents won\'t always be a phone call away. Call them.',
    'Bedtime stories deserve your full presence, not divided attention.',
    'Family time is a limited resource — spend it wisely, screen-free.',
    'The best memories rarely involve a screen in the room.',
    'Put the phone away and ask someone about their day.',
  ],
  focus: [
    'Your concentration span is shrinking. Reclaim it, one break at a time.',
    'Every switch between apps costs you minutes of lost focus.',
    'Single-tasking is a superpower now. Practice it.',
    'The task in front of you deserves your full attention.',
    'Multitasking is a myth — your brain just switches slower than you think.',
    'Deep focus feels uncomfortable at first, then incredibly rewarding.',
    'Turn the phone face down and watch your focus return.',
    'Distraction is the default. Focus is a choice you make now.',
    'Your best work happens in the silence after you close the app.',
    'One task, fully finished, beats five tasks half-started.',
  ],
  creativity: [
    'Your creativity thrives in boredom. Let your mind wander.',
    'Ideas rarely appear mid-scroll. Give your mind some empty space.',
    'Doodle, write, hum — anything but consuming someone else\'s content.',
    'The best ideas come when you stop looking for them online.',
    'Unstructured time is where imagination gets to play.',
    'Make something today instead of only consuming what others made.',
    'Your hands remember how to create — give them the chance.',
    'A blank page is more generous than an infinite feed.',
    'Curiosity about the real world fuels better ideas than any app.',
  ],
  growth: [
    'Your future self will thank you for this break.',
    'Books offer depth that social media can\'t match. Pick one up.',
    'Comparison on social media steals your joy. Step away from it.',
    'Real experiences outlast digital ones. Go make one.',
    'Growth happens outside the comfort of the scroll.',
    'Digital detox isn\'t punishment, it\'s self-care.',
    'Morning routines without screens set a better tone for the whole day.',
    'You become what you repeatedly give your attention to. Choose wisely.',
    'The version of you that you want to become isn\'t built on a screen.',
    'Learning a new skill beats watching someone else use theirs.',
    'Reflection needs quiet — the kind your phone rarely allows.',
  ],
};

export const QUOTES: Quote[] = Object.entries(raw).flatMap(([category, texts]) =>
  texts.map((text, i) => ({
    id: `${category}-${i}`,
    text,
    category: category as QuoteCategory,
  }))
);

export function getCategoryMeta(category: QuoteCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];
}

export function getQuotesByCategories(categories?: QuoteCategory[]): Quote[] {
  if (!categories || categories.length === 0) return QUOTES;
  return QUOTES.filter((q) => categories.includes(q.category));
}

export function getRandomQuote(categories?: QuoteCategory[], exclude?: string): Quote {
  const pool = getQuotesByCategories(categories);
  const candidates = exclude && pool.length > 1 ? pool.filter((q) => q.id !== exclude) : pool;
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}

// Deterministic "quote of the day" so it stays stable across app opens.
export function getQuoteOfTheDay(date: Date = new Date()): Quote {
  const dayKey = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = dayKey % QUOTES.length;
  return QUOTES[index];
}

export function findQuoteById(id: string): Quote | undefined {
  return QUOTES.find((q) => q.id === id);
}

export function searchQuotes(query: string, categories?: QuoteCategory[]): Quote[] {
  const pool = getQuotesByCategories(categories);
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  return pool.filter((quote) => quote.text.toLowerCase().includes(q));
}
