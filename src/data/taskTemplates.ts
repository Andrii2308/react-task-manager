export type TemplateTaskDef = {
  id: string
  title: string
  subtasks: string[]
}

export type TemplateSectionDef = {
  id: string
  title: string
  tasks: TemplateTaskDef[]
}

/** Built-in library (English). User edits are stored in localStorage per account. */
export const DEFAULT_TEMPLATE_SECTIONS: TemplateSectionDef[] = [
  {
    id: "study",
    title: "Study",
    tasks: [
      {
        id: "exam",
        title: "Exam prep session",
        subtasks: [
          "Review notes for the topic",
          "Run practice tests",
          "Memorize dates and key terms",
          "Redo the hardest problems",
          "Get enough sleep the night before",
        ],
      },
      {
        id: "course",
        title: "Finish an online course module",
        subtasks: [
          "Watch the lesson video",
          "Take structured notes",
          "Complete hands-on exercises",
          "Pass the module quiz",
          "Write down open questions",
        ],
      },
      {
        id: "lang",
        title: "Daily language practice",
        subtasks: [
          "Grammar or rule of the day",
          "Learn 10–15 new words in the app",
          "Read a short article or dialogue",
          "Listen to a 10‑minute podcast",
          "Speak or record a short answer",
        ],
      },
      {
        id: "project",
        title: "Term paper or project milestone",
        subtasks: [
          "Confirm requirements with the instructor",
          "Outline sections and timeline",
          "Collect sources and references",
          "Draft the first section",
          "Check citations and formatting",
        ],
      },
      {
        id: "reading",
        title: "Academic reading block",
        subtasks: [
          "Pick the chapter or paper",
          "Read with highlighting for key ideas",
          "Summarize 3–5 bullet takeaways",
          "Draft 1–2 discussion questions",
          "Add the source to your bibliography",
        ],
      },
    ],
  },
  {
    id: "home",
    title: "Home",
    tasks: [
      {
        id: "deep-clean",
        title: "Deep clean the living space",
        subtasks: [
          "Dust surfaces and shelves",
          "Vacuum or mop floors",
          "Declutter and put items away",
          "Empty trash and refresh linens",
          "Open windows for fresh air",
        ],
      },
      {
        id: "laundry",
        title: "Laundry day",
        subtasks: [
          "Sort lights and darks",
          "Run washer and switch to dryer",
          "Fold and put clothes away",
          "Wash bedding if it is due",
          "Restock detergent if low",
        ],
      },
      {
        id: "kitchen",
        title: "Kitchen reset",
        subtasks: [
          "Load or unload dishwasher",
          "Wipe counters and stove",
          "Take inventory of leftovers",
          "Quick fridge check for expired food",
          "Prep containers for tomorrow",
        ],
      },
      {
        id: "plants",
        title: "Plants and pets routine",
        subtasks: [
          "Water plants that need it",
          "Check soil and sunlight",
          "Feed pets on schedule",
          "Clean litter or bedding",
          "Note any vet or supply needs",
        ],
      },
      {
        id: "errands-home",
        title: "Home errands list",
        subtasks: [
          "Replace light bulbs or filters",
          "Fix the squeaky hinge or handle",
          "Order missing household items",
          "Schedule repair if something broke",
          "Update shared family calendar",
        ],
      },
    ],
  },
  {
    id: "work",
    title: "Work",
    tasks: [
      {
        id: "week-plan",
        title: "Weekly work plan",
        subtasks: [
          "Review the meeting calendar",
          "List your top three priorities",
          "Block time for deep work",
          "Check deadlines and stakeholders",
          "Reserve a short break each day",
        ],
      },
      {
        id: "inbox",
        title: "Clear inbox and messages",
        subtasks: [
          "Process emails older than 48h",
          "Reply to urgent threads",
          "Unsubscribe or archive noise",
          "Flag follow-ups with dates",
          "Update task tracker statuses",
        ],
      },
      {
        id: "report",
        title: "Status report or deck",
        subtasks: [
          "Gather metrics from last week",
          "Outline slides or doc sections",
          "Draft narrative and risks",
          "Add charts or screenshots",
          "Proofread and send for review",
        ],
      },
      {
        id: "one-on-one",
        title: "Prepare for a 1:1",
        subtasks: [
          "List wins since last meeting",
          "Note blockers and questions",
          "Gather feedback you owe others",
          "Review their previous action items",
          "Pick one growth topic to discuss",
        ],
      },
      {
        id: "focus-block",
        title: "Deep work block",
        subtasks: [
          "Turn off non-essential notifications",
          "Set a timer for 50–90 minutes",
          "Work only on one deliverable",
          "Capture interruptions on a sticky list",
          "Log what you shipped in notes",
        ],
      },
    ],
  },
  {
    id: "finance",
    title: "Finance & admin",
    tasks: [
      {
        id: "bills",
        title: "Bills and subscriptions",
        subtasks: [
          "Check email for invoices and bills",
          "Pay anything due this week",
          "Cancel unused subscriptions",
          "Update the expense spreadsheet",
          "Set a calendar alert for renewals",
        ],
      },
      {
        id: "docs",
        title: "Important documents",
        subtasks: [
          "Scan or photograph key papers",
          "Upload to secure cloud folder",
          "Check passport and ID expiry dates",
          "Review insurance policy renewal",
          "Backup files to a second location",
        ],
      },
      {
        id: "tax-prep",
        title: "Tax prep mini-session",
        subtasks: [
          "Collect last year’s forms",
          "Gather donation and medical receipts",
          "List freelance or side income",
          "Note estimated payments made",
          "Book accountant if you use one",
        ],
      },
      {
        id: "budget",
        title: "Budget check-in",
        subtasks: [
          "Compare spending to plan",
          "Move extra cash to savings",
          "Adjust category limits if needed",
          "Plan one no-spend weekend",
          "Celebrate hitting a savings goal",
        ],
      },
      {
        id: "goals",
        title: "Financial goals review",
        subtasks: [
          "Update net worth snapshot",
          "Review emergency fund target",
          "Check investment portfolio drift",
          "Plan next debt snowball payment",
          "Read one finance article for ideas",
        ],
      },
    ],
  },
  {
    id: "health",
    title: "Health & wellness",
    tasks: [
      {
        id: "move",
        title: "Movement break",
        subtasks: [
          "Warm up for five minutes",
          "Pick cardio or strength focus",
          "Complete a 20–40 minute session",
          "Cool down and stretch",
          "Drink water before and after",
        ],
      },
      {
        id: "sleep",
        title: "Sleep hygiene night",
        subtasks: [
          "Stop screens 45 minutes before bed",
          "Dim lights and lower temperature",
          "Read or journal instead of scrolling",
          "Set alarm for consistent wake time",
          "Note what helped you fall asleep",
        ],
      },
      {
        id: "checkup",
        title: "Medical check-up planning",
        subtasks: [
          "Find available appointments",
          "List symptoms or questions",
          "Bring insurance card and ID",
          "Schedule labs if required",
          "File visit notes in health folder",
        ],
      },
      {
        id: "hydrate",
        title: "Hydration and fuel day",
        subtasks: [
          "Fill bottle at breakfast",
          "Drink before each meal",
          "Limit sugary drinks to one",
          "Add fruit or herbal tea variety",
          "Track how you feel in the evening",
        ],
      },
      {
        id: "mental",
        title: "Mental health tune-up",
        subtasks: [
          "Five‑minute breathing exercise",
          "Write three gratitudes",
          "Take a short walk outside",
          "Message someone you trust",
          "Note one boundary you will keep",
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Social",
    tasks: [
      {
        id: "reach-out",
        title: "Reach out to family",
        subtasks: [
          "Call or voice message a relative",
          "Share a photo or memory",
          "Ask how their week really went",
          "Plan the next visit or video chat",
          "Send a thank-you if someone helped",
        ],
      },
      {
        id: "friends",
        title: "Friend maintenance",
        subtasks: [
          "Reply to long-pending chats",
          "Propose a concrete hangout time",
          "Share an article or meme they would like",
          "Listen without offering fixes",
          "Follow up after they had big news",
        ],
      },
      {
        id: "network",
        title: "Light networking",
        subtasks: [
          "Comment on one thoughtful post",
          "Send a short LinkedIn note",
          "Offer an intro between two people",
          "Save interesting profiles to revisit",
          "Log who you promised to help",
        ],
      },
      {
        id: "community",
        title: "Community or volunteering",
        subtasks: [
          "Find one local event or shift",
          "Sign up for a mailing list",
          "Donate items you no longer need",
          "Invite a friend to join you",
          "Reflect on what you learned there",
        ],
      },
      {
        id: "celebrate",
        title: "Celebrate someone’s win",
        subtasks: [
          "Send a congrats message",
          "Post a supportive story if they agree",
          "Offer a small treat or coffee",
          "Ask what support they still need",
          "Mark the date for the next milestone",
        ],
      },
    ],
  },
  {
    id: "rest",
    title: "Rest & leisure",
    tasks: [
      {
        id: "digital-sabbath",
        title: "Low-screen evening",
        subtasks: [
          "Set phone to focus or grayscale",
          "Pick a paper book or puzzle",
          "Take a bath or long shower",
          "Play calm music or nature sounds",
          "Journal how offline time felt",
        ],
      },
      {
        id: "weekend-trip",
        title: "Mini weekend adventure",
        subtasks: [
          "Pick a direction within one hour drive",
          "Pack snacks and water",
          "Leave early to beat crowds",
          "Capture a few photos, not hundreds",
          "Grab dinner somewhere new on the way back",
        ],
      },
      {
        id: "hobby",
        title: "Hobby deep dive",
        subtasks: [
          "Set up your workspace",
          "Follow a tutorial for 45 minutes",
          "Finish one small piece or layer",
          "Clean tools before stopping",
          "Schedule next session on calendar",
        ],
      },
      {
        id: "media",
        title: "Curated movie or show night",
        subtasks: [
          "Choose one title in advance",
          "Dim lights and silence notifications",
          "Prepare a simple snack",
          "Watch without multitasking",
          "Note a favorite line or scene",
        ],
      },
      {
        id: "nature",
        title: "Nature reset",
        subtasks: [
          "Pick park or trail nearby",
          "Pack sunscreen and water",
          "Leave earbuds at home optional",
          "Sit still for five minutes listening",
          "Send yourself a voice memo takeaway",
        ],
      },
    ],
  },
  {
    id: "weight",
    title: "Weight management",
    tasks: [
      {
        id: "meal-prep",
        title: "Weekly meal prep",
        subtasks: [
          "Plan dinners on a simple grid",
          "Cook two base proteins",
          "Chop vegetables for grab bowls",
          "Portion snacks into containers",
          "Freeze one backup meal",
        ],
      },
      {
        id: "tracking",
        title: "Track food honestly",
        subtasks: [
          "Log breakfast before coffee",
          "Weigh or estimate portions",
          "Note emotional hunger triggers",
          "Review macros or calories at night",
          "Celebrate consistent logging streak",
        ],
      },
      {
        id: "steps",
        title: "Step and NEAT boost",
        subtasks: [
          "Take a 10‑minute morning walk",
          "Use stairs twice today",
          "Park farther on purpose",
          "Stand during one meeting",
          "Stretch hips after sitting blocks",
        ],
      },
      {
        id: "weigh-in",
        title: "Gentle weigh-in routine",
        subtasks: [
          "Same scale and time of day",
          "Log number without judgment",
          "Write one habit that went well",
          "Adjust calories by small increments only",
          "Text an accountability partner if you use one",
        ],
      },
      {
        id: "swap",
        title: "Swap one indulgence",
        subtasks: [
          "Pick the snack you overeat most",
          "Buy a lighter alternative in advance",
          "Pre-portion before cravings hit",
          "Drink sparkling water first",
          "Note if craving passed in ten minutes",
        ],
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    tasks: [
      {
        id: "groceries",
        title: "Weekly grocery run",
        subtasks: [
          "Check pantry and fridge staples",
          "List proteins for four dinners",
          "Add breakfast and produce basics",
          "Grab dairy or alt milk if low",
          "Stick to the perimeter first",
        ],
      },
      {
        id: "household",
        title: "Household supplies restock",
        subtasks: [
          "Paper goods and cleaning sprays",
          "Batteries and light bulbs",
          "Trash bags and filters",
          "Laundry detergent sale check",
          "Replace worn kitchen tools",
        ],
      },
      {
        id: "pharmacy",
        title: "Pharmacy and health aisle",
        subtasks: [
          "Refill prescriptions if due",
          "Sunscreen and first aid tape",
          "Vitamins you actually take",
          "Travel-size toiletries backup",
          "Check rewards or coupons quickly",
        ],
      },
      {
        id: "gifts",
        title: "Gifts and occasions",
        subtasks: [
          "List upcoming birthdays",
          "Set a budget per person",
          "Buy wrap and cards early",
          "Ship online orders with buffer",
          "Track who you thanked already",
        ],
      },
      {
        id: "clothing",
        title: "Clothing essentials refresh",
        subtasks: [
          "Try on items sitting in closet",
          "Donate what does not fit",
          "Buy one quality replacement piece",
          "Check shoe wear on sneakers",
          "Note sizes before online orders",
        ],
      },
    ],
  },
]

export function cloneDefaultTemplateSections(): TemplateSectionDef[] {
  return JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_SECTIONS)) as TemplateSectionDef[]
}
