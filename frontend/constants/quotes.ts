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
  | 'growth'
  | 'other';

export interface Quote {
  id: string;
  text: string;
  category: QuoteCategory;
  custom?: boolean;
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
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#95A5A6' },
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
    'Your thumb has done enough scrolling for today. Give it a rest.',
    'Headaches from screen glare are your body asking you to look away.',
    'Ten push-ups right now will do more for you than ten more posts.',
    'Your immune system works better when you\'re not sitting still for hours.',
    'The gym doesn\'t care about your streak. Your body does. Go move it.',
    'Screen time and sitting time are usually the same time. Break both.',
    'Your jaw is probably clenched right now. Notice it. Release it.',
    'A short stretch break resets circulation your scrolling thumb can\'t.',
    'Appetite cues get confused by mindless scrolling through mealtimes. Eat present.',
    'Your body was built to move, not to mirror the shape of your phone.',
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
    'You can\'t hug someone through a screen. Go find them.',
    'The best inside jokes are born in person, not in group chats.',
    'Nobody ever said "I wish we\'d texted more" looking back on their life.',
    'A phone-free walk with a friend beats a week of liking their posts.',
    'Your partner would rather have five undistracted minutes than fifty half-present ones.',
    'Reply to the message later. Look at the person in front of you now.',
    'Loneliness rarely gets cured by more scrolling. Reach out instead.',
    'The friend you haven\'t called in months is one tap away. Do it.',
    'Vulnerability happens face to face, not through a filtered feed.',
    'Your community needs your presence more than your engagement.',
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
    'You\'ll never regret the hour you spent focused. You will regret the hour you didn\'t.',
    'Checking your phone "just for a second" always costs more than a second.',
    'The task you\'re avoiding is easier than the guilt of avoiding it.',
    'Your inbox will still be there in twenty focused minutes. Start now.',
    'Deep work is a skill. Every distraction-free minute trains it.',
    'You don\'t need more time. You need fewer interruptions.',
    'Finish one thing before you open one more tab.',
    'The plan you made this morning didn\'t include an hour of scrolling. Stick to it.',
    'Willpower is a muscle — the phone in your pocket is testing it right now.',
    'Success is mostly just doing the thing while everyone else is distracted.',
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
    'Try three slow breaths before your next unlock. Notice what changes.',
    'Restlessness is just a craving for the next notification. Let it pass.',
    'The itch to check your phone will fade in seconds if you don\'t feed it.',
    'Stillness feels unfamiliar now. That\'s exactly why it\'s worth practicing.',
    'You are not your notifications. You are the one choosing to look, or not.',
    'A quiet mind hears things a busy feed drowns out.',
    'Watch the urge to scroll rise and fall like a wave, without riding it.',
    'Gratitude for this exact moment doesn\'t fit in a scrolling thumb.',
    'The app will still be there. This feeling of presence might not be, if you look away.',
    'One mindful minute is worth more than an hour of mindless scrolling.',
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
    'One more video is never actually just one more video at midnight.',
    'Your phone on the nightstand is the last thing arguing against your rest.',
    'Melatonin doesn\'t stand a chance against a bright screen an inch from your face.',
    'The scroll that keeps you up rarely feels worth it in the morning.',
    'A wind-down routine without screens tells your brain it\'s safe to rest.',
    'Sleep debt doesn\'t forgive itself. Pay it back starting tonight.',
    'Your best ideas tomorrow depend on the sleep you protect tonight.',
    'Night mode dims the light, not the pull. Put the phone away instead.',
    'Rest is productive too, even though it doesn\'t feel like it at midnight.',
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
    'Rain sounds better on your skin than in an ambience app.',
    'The horizon doesn\'t buffer, doesn\'t lag, and doesn\'t need your likes.',
    'Clouds change shape slower than feeds, and it\'s somehow more satisfying to watch.',
    'Your lungs were made for real air, not the light of a screen.',
    'Go touch grass. Literally. It helps more than it sounds like it should.',
    'The weather outside is happening whether or not you check the app for it.',
    'Wind on your face is a sensation no notification can replicate.',
    'Somewhere outside right now, something is blooming that you haven\'t seen.',
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
    'Your kid just did something worth watching. Was your phone in the way?',
    'Family photos are better when you\'re actually looking up while taking them.',
    'One day they\'re grown, and you can\'t get these small moments back.',
    'A sibling video-called you to talk, not to compete with your feed.',
    'The dinner table is not the place for four separate screens.',
    'Grandparents don\'t get unlimited time. Give them your full attention while you can.',
    'Family game night beats family scroll night, every single time.',
    'Your presence at home is felt even when nobody says it out loud.',
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
    'It takes over twenty minutes to fully refocus after a notification. Was it worth it?',
    'Attention residue lingers long after you swipe away. Protect your focus proactively.',
    'The best flow states start with putting the phone in another room.',
    'Every unlock resets your focus clock back to zero.',
    'Your brain can\'t deep-focus and shallow-scroll at the same time. Pick one.',
    'Focus isn\'t found. It\'s protected, on purpose, one blocked distraction at a time.',
    'Fewer tabs, fewer apps, fewer pings — more of what actually matters.',
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
    'Consuming endlessly leaves no room to create anything of your own.',
    'The song, story, or drawing in you needs quiet you haven\'t given it yet.',
    'Every great idea you\'ve had arrived when you weren\'t staring at a screen.',
    'Imitation lives in feeds. Originality lives in the space you protect from them.',
    'Pick up the instrument, the pen, or the tool instead of the phone, just once today.',
    'Your inner critic gets louder online and quieter when you\'re actually making something.',
    'Constraints spark creativity. An empty afternoon is the best constraint there is.',
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
    'You are not behind. You are exactly where consistent effort will take you next.',
    'Every app is optimized to keep you. Choose to leave anyway.',
    'The person you\'ll be in a year is built from what you do in minutes like this one.',
    'Discomfort now, growth later. Scrolling now, regret later. Pick your later.',
    'Nobody grew by being comfortable. Put the phone down and get uncomfortable.',
    'Small, boring, repeated actions are what change actually looks like.',
    'You don\'t need motivation. You need one small action, right now, without your phone.',
    'The algorithm doesn\'t want you to grow. It wants you to stay. You get to choose.',
    'Progress is invisible day to day and undeniable year to year. Keep going.',
    'Your habits are quietly voting for the person you\'re becoming. Vote well.',
  ],
  other: [
    'Whatever brought you here, this next moment is yours to spend well.',
    'You opened this app instead of the one that steals your time. That\'s a win.',
    'This is your reminder that you\'re capable of more than one more scroll.',
    'Not every category fits neatly — sometimes you just need a nudge. Here it is.',
    'You get to decide what this next hour is used for. Choose on purpose.',
    'Whatever you\'re working on, working toward, or working through — keep going.',
    'This moment doesn\'t need an explanation. Just put the phone down for now.',
    'Add your own reminders below — the ones that actually work for you.',
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

// All of these helpers accept an optional `extra` pool (e.g. user-submitted
// custom quotes from AppContext) which gets merged in alongside the
// built-in QUOTES. Callers that don't pass one just get the built-ins.

export function getQuotesByCategories(categories?: QuoteCategory[], extra: Quote[] = []): Quote[] {
  const pool = extra.length ? [...QUOTES, ...extra] : QUOTES;
  if (!categories || categories.length === 0) return pool;
  return pool.filter((q) => categories.includes(q.category));
}

export function getRandomQuote(categories?: QuoteCategory[], exclude?: string, extra: Quote[] = []): Quote {
  const pool = getQuotesByCategories(categories, extra);
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

export function findQuoteById(id: string, extra: Quote[] = []): Quote | undefined {
  return QUOTES.find((q) => q.id === id) ?? extra.find((q) => q.id === id);
}

export function searchQuotes(query: string, categories?: QuoteCategory[], extra: Quote[] = []): Quote[] {
  const pool = getQuotesByCategories(categories, extra);
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  return pool.filter((quote) => quote.text.toLowerCase().includes(q));
}
