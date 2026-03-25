export const CATEGORY_META = {
  travel: {
    key: "travel",
    name: "Travel Impulse",
    compactName: "Travel",
    color: "#57D4D0",
    glow: "rgba(87, 212, 208, 0.28)",
  },
  finance: {
    key: "finance",
    name: "Finance / Degen Satire",
    compactName: "Finance",
    color: "#F3C969",
    glow: "rgba(243, 201, 105, 0.26)",
  },
  discipline: {
    key: "discipline",
    name: "Discipline / Self-Correction",
    compactName: "Discipline",
    color: "#7ED38B",
    glow: "rgba(126, 211, 139, 0.26)",
  },
  social: {
    key: "social",
    name: "Romantic / Social Chaos",
    compactName: "Social",
    color: "#FB8FB2",
    glow: "rgba(251, 143, 178, 0.28)",
  },
  mythology: {
    key: "mythology",
    name: "Absurd Spirituality",
    compactName: "Spirituality",
    color: "#B59CFF",
    glow: "rgba(181, 156, 255, 0.26)",
  },
};

const BASE_OUTCOMES = [
  {
    id: 1,
    category: "travel",
    shortLabel: "Bali Now",
    label: "Pack for Bali immediately.",
    interpretation:
      "Your soul wants a soft launch in humidity. This is not wisdom; this is the universe romanticizing carry-on luggage.",
    shareText: 'The Nomad Decision Wheel told me: "Pack for Bali immediately." Honestly, fair.',
  },
  {
    id: 2,
    category: "travel",
    shortLabel: "Cheap Flight",
    label: "Book the cheapest flight and ask questions later.",
    interpretation:
      "Budget airlines are just destiny with worse legroom. Confusion is part of the route map.",
    shareText:
      'The Nomad Decision Wheel told me: "Book the cheapest flight and ask questions later." My standards folded instantly.',
  },
  {
    id: 3,
    category: "travel",
    shortLabel: "Sunrise Visa",
    label: "Do the sunrise visa run and pretend it is a pilgrimage.",
    interpretation:
      "Every border crossing becomes sacred when you are underslept enough. Bureaucracy is merely spirituality in a lanyard.",
    shareText:
      'The Nomad Decision Wheel told me: "Do the sunrise visa run and pretend it is a pilgrimage." Harsh but cinematic.',
  },
  {
    id: 4,
    category: "travel",
    shortLabel: "Midnight Train",
    label: "Take the overnight train and let insomnia become a worldview.",
    interpretation:
      "Not sleeping in motion feels profound until morning. Still, a rattling carriage is cheaper than therapy.",
    shareText:
      'The Nomad Decision Wheel told me: "Take the overnight train and let insomnia become a worldview." The rail gods have spoken.',
  },
  {
    id: 5,
    category: "travel",
    shortLabel: "One-Way Era",
    label: "Buy the one-way ticket. Narrative structure will emerge later.",
    interpretation:
      "A return date is just fear wearing a calendar. The plot thickens most when the spreadsheet goes silent.",
    shareText:
      'The Nomad Decision Wheel told me: "Buy the one-way ticket." Apparently closure is optional.',
  },
  {
    id: 6,
    category: "travel",
    shortLabel: "Airport Sleep",
    label: "Sleep at the airport and call it a liminal reset.",
    interpretation:
      "The terminal is where ambition and dehydration shake hands. Your next chapter smells faintly like duty-free perfume.",
    shareText:
      'The Nomad Decision Wheel told me: "Sleep at the airport and call it a liminal reset." Disturbingly on brand.',
  },
  {
    id: 7,
    category: "travel",
    shortLabel: "Border Town",
    label: "Spend 48 hours in a border town for the character development.",
    interpretation:
      "You keep asking life for texture, then panic when texture arrives. Growth often looks like a train station with bad coffee.",
    shareText:
      'The Nomad Decision Wheel told me: "Spend 48 hours in a border town." Character development remains undefeated.',
  },
  {
    id: 8,
    category: "travel",
    shortLabel: "Hostel Plot",
    label: "Switch to a hostel for one night and absorb the lore.",
    interpretation:
      "Private rooms preserve dignity; hostel kitchens generate myth. Choose the story, not the sleep score.",
    shareText:
      'The Nomad Decision Wheel told me: "Switch to a hostel for one night and absorb the lore." I fear it is correct.',
  },
  {
    id: 9,
    category: "travel",
    shortLabel: "Scooter Yes",
    label: "Rent the scooter. Negotiate with fate at every intersection.",
    interpretation:
      "Mobility is freedom with worse insurance. The helmet cannot protect you from the plotline, only the pavement.",
    shareText:
      'The Nomad Decision Wheel told me: "Rent the scooter." Legal clarity was never part of the fantasy.',
  },
  {
    id: 10,
    category: "travel",
    shortLabel: "Coworking Swap",
    label: "Abandon your current city before the coworking playlist breaks you.",
    interpretation:
      "When every espresso tastes like trapped potential, relocation becomes self-defense. Reinvention loves a new Wi-Fi password.",
    shareText:
      'The Nomad Decision Wheel told me: "Abandon your current city before the coworking playlist breaks you." Painfully specific.',
  },
  {
    id: 11,
    category: "finance",
    shortLabel: "3x BTC",
    label: "3x leverage BTC tonight.",
    interpretation:
      "This is not financial advice. This is theater with candlesticks, and your ego keeps buying front-row seats.",
    shareText:
      'The Nomad Decision Wheel told me: "3x leverage BTC tonight." For legal reasons I am calling this performance art.',
  },
  {
    id: 12,
    category: "finance",
    shortLabel: "Chart Research",
    label: "Open the chart and pretend it is research.",
    interpretation:
      "A line moving diagonally can hypnotize even the educated. Your conviction currently has the nutritional value of a tweet.",
    shareText:
      'The Nomad Decision Wheel told me: "Open the chart and pretend it is research." It reads me too well.',
  },
  {
    id: 13,
    category: "finance",
    shortLabel: "Stablecoin Prayer",
    label: "Rotate into stablecoins and call it inner peace.",
    interpretation:
      "Sometimes survival is just volatility avoidance in tasteful packaging. Serenity, but make it denominated.",
    shareText:
      'The Nomad Decision Wheel told me: "Rotate into stablecoins and call it inner peace." Monastic behavior.',
  },
  {
    id: 14,
    category: "finance",
    shortLabel: "DCA Delusion",
    label: "Set a tiny DCA and speak about discipline very loudly.",
    interpretation:
      "Automating a modest amount does not make you enlightened, but it does make you less exhausting. Progress can be boring and therefore holy.",
    shareText:
      'The Nomad Decision Wheel told me: "Set a tiny DCA and speak about discipline very loudly." A balanced humiliation.',
  },
  {
    id: 15,
    category: "finance",
    shortLabel: "Macro Thread",
    label: "Read one macro thread and become temporarily unbearable.",
    interpretation:
      "You crave the sensation of context more than context itself. Please hydrate before explaining liquidity cycles at lunch.",
    shareText:
      'The Nomad Decision Wheel told me: "Read one macro thread and become temporarily unbearable." The attack was personal.',
  },
  {
    id: 16,
    category: "finance",
    shortLabel: "Alt Season",
    label: "Convince yourself alt season starts next Tuesday.",
    interpretation:
      "Forecasting is easiest when the deadline is imaginary. Hope remains the most over-leveraged asset in your portfolio.",
    shareText:
      'The Nomad Decision Wheel told me: "Convince yourself alt season starts next Tuesday." I choose delusion with timing.',
  },
  {
    id: 17,
    category: "finance",
    shortLabel: "Exit Liquidity",
    label: "Do not become exit liquidity for a man with a dragon avatar.",
    interpretation:
      "Some warnings arrive as wisdom, others as profile pictures. Trust neither fully, but especially not the dragon.",
    shareText:
      'The Nomad Decision Wheel told me: "Do not become exit liquidity for a man with a dragon avatar." Sensible, somehow.',
  },
  {
    id: 18,
    category: "finance",
    shortLabel: "P&L Fast",
    label: "Close the app before your P&L becomes a personality.",
    interpretation:
      "Numbers were meant to inform you, not narrate your worth. Log off before the drawdown gets autobiographical.",
    shareText:
      'The Nomad Decision Wheel told me: "Close the app before your P&L becomes a personality." Devastatingly fair.',
  },
  {
    id: 19,
    category: "finance",
    shortLabel: "Cash Gang",
    label: "Hold cash and let the timeline call you cowardly.",
    interpretation:
      "Restraint looks embarrassing right before it looks elegant. The crowd hates patience until the candles turn biblical.",
    shareText:
      'The Nomad Decision Wheel told me: "Hold cash and let the timeline call you cowardly." My villain origin begins here.',
  },
  {
    id: 20,
    category: "finance",
    shortLabel: "Wallet Audit",
    label: "Check every wallet you forgot you made.",
    interpretation:
      "Somewhere in the ruins of your browser lies either treasure or shame. Both are valid archeological outcomes.",
    shareText:
      'The Nomad Decision Wheel told me: "Check every wallet you forgot you made." Excavation mode activated.',
  },
  {
    id: 21,
    category: "discipline",
    shortLabel: "Touch Grass",
    label: "Touch grass before making any decisions.",
    interpretation:
      "The planet remains an underrated user interface. Go outside until your nervous system stops refreshing itself.",
    shareText:
      'The Nomad Decision Wheel told me: "Touch grass before making any decisions." Nature remains undefeated.',
  },
  {
    id: 22,
    category: "discipline",
    shortLabel: "Bible Mode",
    label: "Close the laptop and read the Bible, or at least something older than Twitter.",
    interpretation:
      "Ancient text has a way of humiliating modern urgency. If nothing else, you will encounter sentences that survived longer than your tabs.",
    shareText:
      'The Nomad Decision Wheel told me: "Close the laptop and read the Bible, or at least something older than Twitter." Brutal and elegant.',
  },
  {
    id: 23,
    category: "discipline",
    shortLabel: "Inbox Zero",
    label: "Reply to the email you have been emotionally dodging.",
    interpretation:
      "Avoidance creates more lore than labor. Send the message before your imagination turns it into a medieval curse.",
    shareText:
      'The Nomad Decision Wheel told me: "Reply to the email you have been emotionally dodging." Accountability has entered the chat.',
  },
  {
    id: 24,
    category: "discipline",
    shortLabel: "Sleep First",
    label: "Sleep before you attempt another reinvention.",
    interpretation:
      "Half your breakthroughs are just exhaustion wearing a prophet costume. Consciousness deserves a reboot before strategy does.",
    shareText:
      'The Nomad Decision Wheel told me: "Sleep before you attempt another reinvention." The anti-hustle oracle speaks.',
  },
  {
    id: 25,
    category: "discipline",
    shortLabel: "Cold Shower",
    label: "Take a cold shower and stop negotiating with your own excuses.",
    interpretation:
      "Discomfort clarifies the script quickly. You do not need a new identity, only lower water temperature and fewer loopholes.",
    shareText:
      'The Nomad Decision Wheel told me: "Take a cold shower and stop negotiating with your own excuses." Annoyingly effective energy.',
  },
  {
    id: 26,
    category: "discipline",
    shortLabel: "Delete Apps",
    label: "Delete three apps and reclaim fragments of your soul.",
    interpretation:
      "Not every portal deserves access to your thumb. Sometimes ascension is merely fewer notifications.",
    shareText:
      'The Nomad Decision Wheel told me: "Delete three apps and reclaim fragments of your soul." Minimalism but dramatic.',
  },
  {
    id: 27,
    category: "discipline",
    shortLabel: "Deep Work",
    label: "Do one unsexy deep-work block without announcing it.",
    interpretation:
      "Silent competence is suspiciously powerful. The algorithm cannot validate what you quietly finish, which is precisely the point.",
    shareText:
      'The Nomad Decision Wheel told me: "Do one unsexy deep-work block without announcing it." We are entering monastic productivity.',
  },
  {
    id: 28,
    category: "discipline",
    shortLabel: "Receipt Check",
    label: "Review your last ten expenses and feel the correction arrive.",
    interpretation:
      "Your card statement is a memoir written in small betrayals. Read it like scripture, then maybe stop buying symbolic beverages.",
    shareText:
      'The Nomad Decision Wheel told me: "Review your last ten expenses and feel the correction arrive." Financial shame as user experience.',
  },
  {
    id: 29,
    category: "discipline",
    shortLabel: "Gym Apology",
    label: "Go to the gym and apologize to your spine.",
    interpretation:
      "Your posture has been freelancing without supervision. Restoration begins when your body stops being treated like app infrastructure.",
    shareText:
      'The Nomad Decision Wheel told me: "Go to the gym and apologize to your spine." It is not wrong.',
  },
  {
    id: 30,
    category: "discipline",
    shortLabel: "No Doomscroll",
    label: "Log off for six hours and let the world continue without your surveillance.",
    interpretation:
      "Events will happen even if you do not witness them in real time. This is either terrifying or liberating, which means it is useful.",
    shareText:
      'The Nomad Decision Wheel told me: "Log off for six hours." The detox arc has begun.',
  },
  {
    id: 31,
    category: "social",
    shortLabel: "Text Them",
    label: "Text the person you keep overthinking.",
    interpretation:
      "Your hesitation has already built an entire franchise in your head. One honest sentence can cancel several imaginary sequels.",
    shareText:
      'The Nomad Decision Wheel told me: "Text the person you keep overthinking." Catastrophic clarity.',
  },
  {
    id: 32,
    category: "social",
    shortLabel: "Real-Life Flirt",
    label: "Skip the coworking space and flirt with real life.",
    interpretation:
      "Not every connection needs Wi-Fi and filtered water. Chemistry often performs better outside subscription-based furniture.",
    shareText:
      'The Nomad Decision Wheel told me: "Skip the coworking space and flirt with real life." The timeline cannot save me now.',
  },
  {
    id: 33,
    category: "social",
    shortLabel: "Ghost Refund",
    label: "Do not resurrect the ghost. They are busy haunting someone else.",
    interpretation:
      "Nostalgia is often just bad memory with premium lighting. Leave the dead chat archived.",
    shareText:
      'The Nomad Decision Wheel told me: "Do not resurrect the ghost." Spiritual boundaries have been established.',
  },
  {
    id: 34,
    category: "social",
    shortLabel: "Say Maybe",
    label: "Say yes to the dinner invite you were going to overanalyze.",
    interpretation:
      "Some invitations are not logistical problems. They are portals disguised as casual plans.",
    shareText:
      'The Nomad Decision Wheel told me: "Say yes to the dinner invite." Social courage in capsule form.',
  },
  {
    id: 35,
    category: "social",
    shortLabel: "Leave Groupchat",
    label: "Mute the group chat before it colonizes your mood.",
    interpretation:
      "Community should not feel like twenty-seven simultaneous push notifications. Silence is a love language you owe yourself.",
    shareText:
      'The Nomad Decision Wheel told me: "Mute the group chat before it colonizes your mood." A public service announcement.',
  },
  {
    id: 36,
    category: "social",
    shortLabel: "Beach Date",
    label: "Suggest a beach walk instead of another performative coffee.",
    interpretation:
      "A moving horizon exposes more truth than latte art ever will. Let the scenery do some of the emotional labor.",
    shareText:
      'The Nomad Decision Wheel told me: "Suggest a beach walk instead of another performative coffee." The romance department approves.',
  },
  {
    id: 37,
    category: "social",
    shortLabel: "Apology Arc",
    label: "Send the apology without adding a TED Talk to it.",
    interpretation:
      "Redemption works better without paragraphs of self-branding. Brief sincerity remains underrated and almost suspiciously elegant.",
    shareText:
      'The Nomad Decision Wheel told me: "Send the apology without adding a TED Talk to it." Humbling but useful.',
  },
  {
    id: 38,
    category: "social",
    shortLabel: "Dance Floor",
    label: "Go where the music is louder than your inner monologue.",
    interpretation:
      "Overthinking struggles in rooms with bass. Sometimes enlightenment is just bad lighting and a better playlist.",
    shareText:
      'The Nomad Decision Wheel told me: "Go where the music is louder than your inner monologue." The night shift has spoken.',
  },
  {
    id: 39,
    category: "social",
    shortLabel: "Call Mom",
    label: "Call your mother before you call yourself mysterious.",
    interpretation:
      "Not every silence is depth. Some of it is just overdue affection with a personal brand attached.",
    shareText:
      'The Nomad Decision Wheel told me: "Call your mother before you call yourself mysterious." An elegant correction.',
  },
  {
    id: 40,
    category: "social",
    shortLabel: "Meet Cute",
    label: "Go to the same cafe twice and let probability flirt back.",
    interpretation:
      "Romance is often repetition with better timing. Destiny loves a routine you did not pretend was strategic.",
    shareText:
      'The Nomad Decision Wheel told me: "Go to the same cafe twice and let probability flirt back." Cinema has entered the workflow.',
  },
  {
    id: 41,
    category: "mythology",
    shortLabel: "Village Move",
    label: "Sell everything and move to a Portuguese village in theory.",
    interpretation:
      "Your mind keeps staging exits with beautiful stone walls. It is okay if the fantasy remains decorative, but admire how consistent it is.",
    shareText:
      'The Nomad Decision Wheel told me: "Sell everything and move to a Portuguese village in theory." I support the mood board.',
  },
  {
    id: 42,
    category: "mythology",
    shortLabel: "Street Food",
    label: "Eat street food until you regret it and call it a sacrament.",
    interpretation:
      "Devotion sometimes arrives on a plastic stool. Your stomach may dissent, but your memory will defend the decision for years.",
    shareText:
      'The Nomad Decision Wheel told me: "Eat street food until you regret it and call it a sacrament." Pilgrimage energy.',
  },
  {
    id: 43,
    category: "mythology",
    shortLabel: "Temple WiFi",
    label: "Work from somewhere spiritually inappropriate.",
    interpretation:
      "The sacred and the transactional are already roommates in your life. At least choose a backdrop with stronger architecture.",
    shareText:
      'The Nomad Decision Wheel told me: "Work from somewhere spiritually inappropriate." The gods requested better scenery.',
  },
  {
    id: 44,
    category: "mythology",
    shortLabel: "Mercury Meme",
    label: "Blame Mercury retrograde for a problem you clearly caused.",
    interpretation:
      "Cosmic narratives are cheaper than radical self-honesty. Use sparingly, like incense or plausible deniability.",
    shareText:
      'The Nomad Decision Wheel told me: "Blame Mercury retrograde for a problem you clearly caused." Celestial liability shield deployed.',
  },
  {
    id: 45,
    category: "mythology",
    shortLabel: "Tarot Tab",
    label: "Pull one tarot card and misread it with confidence.",
    interpretation:
      "Symbolism becomes most persuasive when you are conveniently selective. Interpretation is just projection in ceremonial typography.",
    shareText:
      'The Nomad Decision Wheel told me: "Pull one tarot card and misread it with confidence." Accuracy was never the aesthetic.',
  },
  {
    id: 46,
    category: "mythology",
    shortLabel: "Sacred Coconut",
    label: "Order the expensive ceremonial cacao or coconut for morale.",
    interpretation:
      "Not every unnecessary purchase is foolish. Some are simply mood architecture with garnish.",
    shareText:
      'The Nomad Decision Wheel told me: "Order the expensive ceremonial cacao or coconut for morale." Spiritually irresponsible, maybe.',
  },
  {
    id: 47,
    category: "mythology",
    shortLabel: "Moon Briefing",
    label: "Consult the moon before opening your calendar.",
    interpretation:
      "When scheduling feels too mortal, lunar outsourcing appears. The cosmos remains unqualified yet oddly persuasive.",
    shareText:
      'The Nomad Decision Wheel told me: "Consult the moon before opening your calendar." My operations team is now celestial.',
  },
  {
    id: 48,
    category: "mythology",
    shortLabel: "Beach Manifesto",
    label: "Write a beach manifesto you will never publish.",
    interpretation:
      "Private declarations sometimes carry more voltage than public branding. Let the waves proofread your delusions kindly.",
    shareText:
      'The Nomad Decision Wheel told me: "Write a beach manifesto you will never publish." This feels embarrassingly correct.',
  },
  {
    id: 49,
    category: "mythology",
    shortLabel: "Oracle Nap",
    label: "Nap aggressively and call it receiving downloads.",
    interpretation:
      "Rest becomes spiritual once productivity can no longer hijack the language. Consciousness patch notes may arrive in dreams.",
    shareText:
      'The Nomad Decision Wheel told me: "Nap aggressively and call it receiving downloads." Finally, a sustainable doctrine.',
  },
  {
    id: 50,
    category: "mythology",
    shortLabel: "Lagoon Oath",
    label: "Make a dramatic promise to yourself near water.",
    interpretation:
      "Bodies of water make every intention sound cinematic. Whether you keep it is less important than how luminous the scene felt.",
    shareText:
      'The Nomad Decision Wheel told me: "Make a dramatic promise to yourself near water." The lagoon witnessed everything.',
  },
];

const EXTRA_OUTCOMES = [
  {
    id: 51,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "NIGHT FERRY",
    title: "Take the night ferry.",
    detail:
      "Book the route with suspiciously romantic logistics. A questionable transit plan is still a plan, and tonight you need narrative momentum more than perfect posture.",
  },
  {
    id: 52,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "LOCAL SIM",
    title: "Buy the local SIM and stop cosplaying as offline.",
    detail:
      "Airport Wi-Fi is not a long-term personality. Five minutes of admin will rescue hours of low-grade chaos.",
  },
  {
    id: 53,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "BORDER COFFEE",
    title: "Take a bus to the nearest almost-elsewhere.",
    detail:
      "You do not need a life overhaul. You need one new border, one strong coffee, and a slightly different sky.",
  },
  {
    id: 54,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "SUNSET CHECKOUT",
    title: "Leave one day earlier and call it intuition.",
    detail:
      "The itinerary has become too reasonable. Pull one thread and let the trip recover a little mythology.",
  },
  {
    id: 55,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "MAPLESS DAY",
    title: "Spend one afternoon without optimizing the route.",
    detail:
      "Your best travel memory is unlikely to come from a spreadsheet-perfect path. Wander with enough structure to get home.",
  },
  {
    id: 56,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "LAUNDRY VISA",
    title: "Stay long enough to do the laundry properly.",
    detail:
      "Not every extension needs to be spiritual. Some are just a clean-shirt decision wearing a mystical hat.",
  },
  {
    id: 57,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "WINDOW SEAT",
    title: "Pay for the window seat and respect the tiny luxury.",
    detail:
      "You have suffered enough budget-airline theater. Buy the view and let one small indulgence rehabilitate the day.",
  },
  {
    id: 58,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "EARLY TRAIN",
    title: "Take the inconvenient early train.",
    detail:
      "Tomorrow gets easier when today accepts one elegant inconvenience. This is logistics disguised as character development.",
  },
  {
    id: 59,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "HOSTEL DIPLOMACY",
    title: "Talk to strangers before your personality becomes luggage.",
    detail:
      "You did not cross time zones to become a silent Wi-Fi ornament. Start one harmless conversation and see what opens.",
  },
  {
    id: 60,
    category: "travel",
    categoryLabel: "Travel Impulse",
    wheelLabel: "MARKET DETOUR",
    title: "Miss the efficient route on purpose.",
    detail:
      "Detours are where a city stops being content and starts becoming memory. Lose ten minutes and gain a better story.",
  },
  {
    id: 61,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "LIMIT LITURGY",
    title: "Set the order and close the tab.",
    detail:
      "Volatility does not need your live commentary. Write the plan once and let the candles perform without supervision.",
  },
  {
    id: 62,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "FEE REGRET",
    title: "Check what the last transfer actually cost.",
    detail:
      "Mysticism is expensive enough without network fees freelancing as jump scares. Read the receipt and regain one square inch of adulthood.",
  },
  {
    id: 63,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "DRY POWDER",
    title: "Do nothing dramatic and let cash be a personality.",
    detail:
      "Not every market mood requires a response. Sometimes the move is to remain solvent and vaguely smug.",
  },
  {
    id: 64,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "TAX FOLDER",
    title: "Create the tax folder before future-you starts bargaining.",
    detail:
      "A boring folder today is a spiritual protection spell for later. Name it clearly and stop outsourcing hope to memory.",
  },
  {
    id: 65,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "REBALANCE",
    title: "Trim conviction down to an amount that can sleep at night.",
    detail:
      "You are allowed to like an asset without marrying it in public. Rebalance before the chart starts writing fan fiction.",
  },
  {
    id: 66,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "RUG CHECK",
    title: "Read one boring thing before buying one exciting thing.",
    detail:
      "The whitepaper may still be theater, but at least make the theater work for its ticket.",
  },
  {
    id: 67,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "OFF-RAMP DAY",
    title: "Move some gains somewhere unsexy and legal.",
    detail:
      "It does not all need to stay in the casino. Take a slice off the table and let reality keep a percentage.",
  },
  {
    id: 68,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "WALLET LABELS",
    title: "Label your wallets like consequences are real.",
    detail:
      "Unnamed addresses are how chaos earns seniority. Add labels now and save future-you from forensic sadness.",
  },
  {
    id: 69,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "CHART EMBARGO",
    title: "No charts for 12 hours.",
    detail:
      "Your nervous system deserves a ceasefire. The market will continue being unstable without your eyelids supervising it.",
  },
  {
    id: 70,
    category: "finance",
    categoryLabel: "Finance / Degen Satire",
    wheelLabel: "CONVICTION NAP",
    title: "Take a nap before calling it conviction.",
    detail:
      "If you still want the trade after actual rest, it may be a thesis. If not, congratulations on avoiding caffeine-based portfolio theory.",
  },
  {
    id: 71,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "TAB FUNERAL",
    title: "Close the browser graveyard.",
    detail:
      "Those 37 tabs are not ambition. They are a haunted house built out of deferred decisions.",
  },
  {
    id: 72,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "LAUNDRY KARMA",
    title: "Do the laundry and recover a republic of order.",
    detail:
      "Clean fabric is not enlightenment, but it does give chaos fewer places to hide.",
  },
  {
    id: 73,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "HYDRATE FIRST",
    title: "Drink water before designing a new crisis.",
    detail:
      "Some emergencies are just dehydration wearing a startup tone of voice.",
  },
  {
    id: 74,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "CALENDAR CLEANSE",
    title: "Delete the obligations you kept for optics.",
    detail:
      "Your schedule should not look like a museum of outdated versions of you.",
  },
  {
    id: 75,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "DESK RESET",
    title: "Clear one surface and stop rendering background errors.",
    detail:
      "You do not need a life reset right now. You need one visible rectangle of peace.",
  },
  {
    id: 76,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "WALK BLOCK",
    title: "Take one lap around the block.",
    detail:
      "Movement is cheaper than existential analysis and often twice as effective.",
  },
  {
    id: 77,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "SCREEN SABBATH",
    title: "Give the glowing rectangle a short exile.",
    detail:
      "Your phone does not need to be the project manager of your bloodstream for the next 30 minutes.",
  },
  {
    id: 78,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "NOTES TRIAGE",
    title: "Turn the scattered notes into three usable bullets.",
    detail:
      "Raw capture is not clarity. Distill the chaos until one action can survive daylight.",
  },
  {
    id: 79,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "MEAL PREP TRUCE",
    title: "Feed tomorrow before tomorrow becomes dramatic.",
    detail:
      "A container in the fridge is a small peace treaty with your future self.",
  },
  {
    id: 80,
    category: "discipline",
    categoryLabel: "Discipline / Self-Correction",
    wheelLabel: "PASSWORD PEACE",
    title: "Fix one annoying login before it ruins another morning.",
    detail:
      "The ritual is not glamorous, but neither is rage-resetting a password while half-awake.",
  },
  {
    id: 81,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "VOICE NOTE",
    title: "Send the voice note in one take.",
    detail:
      "Text has become too legal. Let your actual tone do some of the emotional heavy lifting.",
  },
  {
    id: 82,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "BRUNCH DIPLOMACY",
    title: "Invite them to a daytime plan with plausible innocence.",
    detail:
      "Not every connection requires moonlight and consequences. A daylight ritual is still a ritual.",
  },
  {
    id: 83,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "REPLY TODAY",
    title: "Reply before your silence gains architecture.",
    detail:
      "Delay has turned this into a cathedral of unnecessary meaning. A normal response will do.",
  },
  {
    id: 84,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "ASK DIRECTLY",
    title: "Trade hints for one sentence with nouns.",
    detail:
      "Ambiguity has had a generous season. Let clarity make one brief guest appearance.",
  },
  {
    id: 85,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "CANCEL KINDLY",
    title: "End the maybe with more grace than avoidance.",
    detail:
      "A clean no is kinder than a haunted maybe. Close the loop like a person with functioning daylight.",
  },
  {
    id: 86,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "NICE THING",
    title: "Say the nice thing without twelve escape hatches.",
    detail:
      "A compliment does not need legal disclaimers. Let warmth survive contact with your self-protection.",
  },
  {
    id: 87,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "PHOTO RECEIPT",
    title: "Send the picture you meant to send weeks ago.",
    detail:
      "Sometimes intimacy is just finally pressing send on an ordinary proof of life.",
  },
  {
    id: 88,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "PICK ONE",
    title: "Stop diffusing your attention across twelve possibilities.",
    detail:
      "Choose one person, one thread, one emotional tab. Your nervous system is not a group project.",
  },
  {
    id: 89,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "EXIT TRIANGLE",
    title: "Choose clarity over gossip.",
    detail:
      "Third-party intrigue is cheap electricity. Walk toward the actual person and let the voltage drop.",
  },
  {
    id: 90,
    category: "social",
    categoryLabel: "Romantic / Social Chaos",
    wheelLabel: "PLAN IT",
    title: "Turn chemistry into a calendar event.",
    detail:
      "The vibe has lingered long enough. Give it a time, a place, and a chance to become evidence.",
  },
  {
    id: 91,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "OMEN AUDIT",
    title: "Reinterpret the coincidence with slightly more discipline.",
    detail:
      "Not every sign is a prophecy, but some of them are at least worth a second look and better posture.",
  },
  {
    id: 92,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "SHRINE PLAYLIST",
    title: "Curate a soundtrack for your temporary destiny.",
    detail:
      "You may not control the cosmos, but you do control the next three songs. Start there.",
  },
  {
    id: 93,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "CANDLE LOGISTICS",
    title: "Light one small ceremonial object.",
    detail:
      "Focus is more willing to arrive when the room admits something symbolic is happening.",
  },
  {
    id: 94,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "MOONWATER MEMO",
    title: "Write the intention down so mysticism has paperwork.",
    detail:
      "The universe may be fluid, but your thoughts still benefit from bullet points.",
  },
  {
    id: 95,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "AURA ADMIN",
    title: "Declutter your room like the energy bill is due.",
    detail:
      "Sometimes aura maintenance is just object management with better branding.",
  },
  {
    id: 96,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "PROPHECY STRETCH",
    title: "Stretch before receiving any cosmic downloads.",
    detail:
      "A flexible hamstring is not wisdom, but it does reduce the odds of mistaking stiffness for revelation.",
  },
  {
    id: 97,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "DESERT SIGNAL",
    title: "Go somewhere quiet enough to hear your better nonsense.",
    detail:
      "Silence is often just premium bandwidth for thoughts that were previously buffering.",
  },
  {
    id: 98,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "SATURN BOUNDARY",
    title: "Say no once and blame the planets if necessary.",
    detail:
      "Boundaries count even when introduced with theatrical celestial support.",
  },
  {
    id: 99,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "ORBITAL CLEANSE",
    title: "Delete one cursed file, one cursed app, and one cursed idea.",
    detail:
      "Not all cleansing requires incense. Some of it requires the courage to hit backspace three times.",
  },
  {
    id: 100,
    category: "mythology",
    categoryLabel: "Absurd Spirituality",
    wheelLabel: "STARDUST BUDGET",
    title: "Make the plan mystical, but keep the spreadsheet open.",
    detail:
      "Dream big, but let one tab remain accountable to arithmetic.",
  },
];

function buildShareText(title) {
  return `The Nomad Decision Wheel told me: "${title}" Honestly, fair.`;
}

function normalizeOutcome(outcome) {
  const categoryMeta = CATEGORY_META[outcome.category];
  const categoryLabel = outcome.categoryLabel ?? categoryMeta?.name ?? outcome.category;
  const wheelLabel = outcome.wheelLabel ?? outcome.shortLabel ?? outcome.title ?? outcome.label;
  const title = outcome.title ?? outcome.label;
  const detail = outcome.detail ?? outcome.interpretation;

  return {
    id: outcome.id,
    category: outcome.category,
    categoryLabel,
    wheelLabel,
    title,
    detail,
    shareText: outcome.shareText ?? buildShareText(title),
    enabled: outcome.enabled ?? true,
    tags: outcome.tags ?? [],
    weight: outcome.weight ?? 1,
    shortLabel: wheelLabel,
    label: title,
    interpretation: detail,
  };
}

export const OUTCOME_LIBRARY = [...BASE_OUTCOMES, ...EXTRA_OUTCOMES]
  .map(normalizeOutcome)
  .sort((a, b) => a.id - b.id);

export const OUTCOMES = OUTCOME_LIBRARY;

export const ALL_CATEGORY_KEYS = Object.keys(CATEGORY_META);

export const MODE_PRESETS = [
  {
    key: "all-fates",
    name: "All Fates",
    description: "Every category online.",
    categories: ALL_CATEGORY_KEYS,
  },
  {
    key: "travel-spiral",
    name: "Travel Spiral",
    description: "Travel Impulse online.",
    categories: ["travel"],
  },
  {
    key: "degen-exposure",
    name: "Degen Exposure",
    description: "Finance satire online.",
    categories: ["finance"],
  },
  {
    key: "repair-mode",
    name: "Repair Mode",
    description: "Discipline online.",
    categories: ["discipline"],
  },
  {
    key: "social-chaos",
    name: "Social Chaos",
    description: "Social chaos online.",
    categories: ["social"],
  },
  {
    key: "moon-logic",
    name: "Moon Logic",
    description: "Absurd Spirituality online.",
    categories: ["mythology"],
  },
];

export const ACCURACY_LEVELS = [
  {
    key: "soft-focus",
    name: "Soft Focus",
    shortLabel: "Soft Focus",
    description: "Gentler copy framing. Shorter theatrics. Same dubious wisdom.",
    statusLabel: "Plausibly Helpful",
    teaserLead: "The wheel cleared its throat and offered:",
    detailLead: "A low-volume omen has arrived.",
    turns: [5, 6],
    duration: [2600, 3400],
    shareSuffix: "Softly offensive. Still fair.",
  },
  {
    key: "ritual-grade",
    name: "Ritual Grade",
    shortLabel: "Ritual Grade",
    description: "Default house blend of ceremony, velocity, and self-aware menace.",
    statusLabel: "Emotionally Dubious",
    teaserLead: "The wheel landed with confidence on:",
    detailLead: "Today's interpretation was delivered with ritual-grade certainty.",
    turns: [7, 9],
    duration: [4300, 5600],
    shareSuffix: "Honestly, fair.",
  },
  {
    key: "catastrophic",
    name: "Catastrophic",
    shortLabel: "Catastrophic",
    description: "Longer spin, louder framing, slightly more operatic packaging.",
    statusLabel: "Suspiciously Certain",
    teaserLead: "The wheel hit the table and declared:",
    detailLead: "The machine has chosen violence, poetry, and a final answer.",
    turns: [9, 11],
    duration: [5200, 6500],
    shareSuffix: "The theater budget was visible.",
  },
];
