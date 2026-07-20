const nameInput = document.getElementById('player-name');
const loadingTitle = document.getElementById('loading-title');
const loadingText = document.getElementById('loading-text');
const loadingNext = document.getElementById('loading-next');
const confettiLayer = document.getElementById('confetti-layer');
const judgeNote = document.getElementById('judge-note');
const achievementLine = document.getElementById('achievement-line');
let currentScreenId = 'screen-welcome';
let usedJokes = new Set();
let loadingTimer = null;

function showScreen(screenId) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen) return;

  const currentScreen = document.getElementById(currentScreenId);
  if (currentScreen) {
    currentScreen.classList.remove('active');
  }

  nextScreen.classList.add('active');
  currentScreenId = screenId;

  if (screenId === 'screen-loading') {
    startLoadingSequence();
  }

  if (screenId === 'screen-final') {
    spawnConfetti();
    showJudgeNote('🎉 Achievement Unlocked: Professional Chaos Creator.', 'funny');
  }

  if (screenId.includes('question') || screenId.includes('reaction')) {
    window.setTimeout(() => {
      if (currentScreenId === screenId) {
        triggerRandomJudgeMoment();
      }
    }, 1200 + Math.random() * 800);
  }
}

function showJudgeNote(message, mood = 'funny') {
  if (!judgeNote) return;
  judgeNote.textContent = message;
  judgeNote.className = `judge-note ${mood} show`;
  clearTimeout(judgeNote.timeoutId);
  judgeNote.timeoutId = window.setTimeout(() => {
    judgeNote.classList.remove('show');
  }, 2600);
}

function triggerRandomJudgeMoment() {
  const lines = [
    'I forgot what I was doing.',
    'Wait...',
    'I changed my mind.',
    'Never mind.',
    "I'm judging you silently.",
    'I need better friends.',
    'I almost respected that answer.',
    'Even my calculator is disappointed.',
    'You click buttons like they are giving away free money.',
    'You had ONE job.',
    'I expected less... and somehow you still surprised me.',
    'Loading common sense... ERROR 404.',
    'I would trust you with my snacks... Actually no.',
    'If overthinking burned calories, you would be an athlete.',
    'Your confidence deserves an award. Your decisions do not.',
    "I've met loading screens with faster reactions.",
    'You remind me of airplane mode. Present... but not really connected.'
  ];
  const moods = ['funny', 'annoyed', 'suspicious', 'creepy'];
  const message = lines[Math.floor(Math.random() * lines.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  showJudgeNote(message, mood);
}

function setScreenText(screenId, heading, lineOne, lineTwo = '') {
  const screen = document.getElementById(screenId);
  if (!screen) return;
  const headingEl = screen.querySelector('h2');
  const copies = screen.querySelectorAll('.screen-copy');

  if (headingEl) {
    headingEl.textContent = heading;
  }
  if (copies[0]) {
    copies[0].textContent = lineOne;
  }
  if (copies[1]) {
    copies[1].textContent = lineTwo;
  }
}

function pickUniqueReaction(choice) {
  const pools = {
    monkey: [
      { heading: 'Interesting.', lineOne: 'You picked the monkey.', lineTwo: 'At least it knows not to click random buttons.', note: '😂 HAHAHA... the monkey. Fine. We are all compromised.', mood: 'funny', key: 'monkey-1' },
      { heading: 'Seriously?', lineOne: 'The monkey?', lineTwo: 'You really went with that?', note: '😒 Seriously? The monkey? You could have chosen literally anything.', mood: 'annoyed', key: 'monkey-2' },
      { heading: 'Wait...', lineOne: 'That was weirdly confident.', lineTwo: 'I respect it. Barely.', note: '🤨 Wait... are you trying to win a contest for bad choices?', mood: 'suspicious', key: 'monkey-3' }
    ],
    potato: [
      { heading: 'Oh no.', lineOne: 'Self-awareness unlocked.', lineTwo: '.', note: '😑 That was disappointing. But also... accurate.', mood: 'annoyed', key: 'potato-1' },
      { heading: 'Wow.', lineOne: 'You chose the potato.', lineTwo: 'That is deeply personal.', note: '😂 HAHAHA... wow. The potato really said what we were all thinking.', mood: 'funny', key: 'potato-2' },
      { heading: 'Something feels wrong...', lineOne: 'Why does this feel so accurate?', lineTwo: 'Never mind. I hate that I get it.', note: '👀 Something feels wrong... and somehow it is still the potato.', mood: 'creepy', key: 'potato-3' }
    ],
    me: [
      { heading: 'Wow.', lineOne: 'You chose yourself.', lineTwo: 'The confidence is loud and unhelpful.', note: '😡 WHY WOULD YOU CLICK THAT?!', mood: 'angry', key: 'me-1' },
      { heading: 'Absolutely.', lineOne: 'The self-loving chaos path.', lineTwo: 'Weirdly impressive.', note: '😂 HAHAHA... yes. Of course you would.', mood: 'funny', key: 'me-2' },
      { heading: 'Wait...', lineOne: 'That was bold.', lineTwo: 'And also a little concerning.', note: '🤨 Wait... that confidence is illegal in some countries.', mood: 'suspicious', key: 'me-3' }
    ],
    fox: [
      { heading: 'Perfect.', lineOne: 'The chaos has a tail.', lineTwo: 'That feels right.', note: '😂 HAHAHA... yes. The fox is dramatic. Obviously.', mood: 'funny', key: 'fox-1' },
      { heading: 'Seriously?', lineOne: 'The fox?', lineTwo: 'You are making this too easy.', note: '😒 Seriously? You really picked the fox. I was hoping for better.', mood: 'annoyed', key: 'fox-2' },
      { heading: 'Suspicious.', lineOne: 'You are too comfortable with this.', lineTwo: 'That is a problem.', note: '👀 Something feels wrong... but the fox is still a valid answer.', mood: 'creepy', key: 'fox-3' }
    ],
    pizza: [
      { heading: 'Classic.', lineOne: 'The pizza has entered the story.', lineTwo: 'Very on brand.', note: '😂 HAHAHA... of course. The pizza is always the villain.', mood: 'funny', key: 'pizza-1' },
      { heading: 'No.', lineOne: 'I refuse to dignify that.', lineTwo: 'But also... fair.', note: '😑 No. I don’t feel like asking the next question. Fine.', mood: 'annoyed', key: 'pizza-2' },
      { heading: 'Wait...', lineOne: 'You chose pizza.', lineTwo: 'That is not a personality. That is a lifestyle.', note: '🤨 Wait... is that a cry for help or a lunch order?', mood: 'suspicious', key: 'pizza-3' }
    ],
    nap: [
      { heading: 'That makes sense.', lineOne: 'You chose the nap.', lineTwo: 'A deeply believable betrayal.', note: '😑 That was disappointing. The nap really won.', mood: 'annoyed', key: 'nap-1' },
      { heading: 'Honestly?', lineOne: 'The nap is winning.', lineTwo: 'You are not even pretending.', note: '😂 HAHAHA... yes. The nap is the true main character.', mood: 'funny', key: 'nap-2' },
      { heading: 'Something feels wrong...', lineOne: 'The room is too quiet.', lineTwo: 'Please tell me you are not asleep right now.', note: '👀 Something feels wrong... and somehow it is still the nap.', mood: 'creepy', key: 'nap-3' }
    ],
    hug: [
      { heading: 'Sweet.', lineOne: 'You chose comfort.', lineTwo: 'That is adorable and slightly suspicious.', note: '😂 HAHAHA... wow. A hug. Very wholesome. Very fake.', mood: 'funny', key: 'hug-1' },
      { heading: 'Seriously?', lineOne: 'A hug?', lineTwo: 'That is the most emotional answer in the room.', note: '😒 Seriously? You are making everything weirdly sincere.', mood: 'annoyed', key: 'hug-2' },
      { heading: 'Wait...', lineOne: 'That was unexpectedly kind.', lineTwo: 'I hate that I respect it.', note: '🤨 Wait... did you just become emotionally available?', mood: 'suspicious', key: 'hug-3' }
    ],
    party: [
      { heading: 'Absolutely.', lineOne: 'You chose celebration.', lineTwo: 'The chaos has a soundtrack.', note: '😂 HAHAHA... yes. A party. Because apparently we are all six years old.', mood: 'funny', key: 'party-1' },
      { heading: 'No.', lineOne: 'No. Not this one.', lineTwo: 'We are not doing this responsibly.', note: '😡 WHY WOULD YOU CLICK THAT?! You have doomed us all.', mood: 'angry', key: 'party-2' },
      { heading: 'Wait...', lineOne: 'That was unreasonably loud.', lineTwo: 'And I hate that I am interested.', note: '🤨 Wait... did you just start a tiny disaster?', mood: 'suspicious', key: 'party-3' }
    ],
    cupcake: [
      { heading: 'Honestly?', lineOne: 'Dessert.', lineTwo: 'You chose dessert over emotional stability.', note: '😂 HAHAHA... wow. The cupcake has won and I cannot even be mad.', mood: 'funny', key: 'cupcake-1' },
      { heading: 'That makes sense.', lineOne: 'A cupcake solves nothing.', lineTwo: 'And yet it feels right.', note: '😑 That was disappointing. But also... a cupcake.', mood: 'annoyed', key: 'cupcake-2' },
      { heading: 'Something feels wrong...', lineOne: 'The frosting is too powerful.', lineTwo: 'I need a minute.', note: '👀 Something feels wrong... and the cupcake is involved.', mood: 'creepy', key: 'cupcake-3' }
    ]
  };

  const pool = pools[choice] || pools.monkey;
  const available = pool.filter((item) => !usedJokes.has(item.key));
  const selected = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : pool[0];
  usedJokes.add(selected.key);
  return selected;
}

function assignAchievement(choice) {
  const map = {
    monkey: '🏆 Professional Button Destroyer',
    potato: '🏆 Potato Brain Survivor',
    me: '🏆 Certified Drama Queen',
    fox: '🏆 Suspicious Individual',
    pizza: '🏆 Emotional Damage Collector',
    nap: '🏆 Emotional Damage Collector',
    hug: '🏆 Certified Drama Queen',
    party: '🏆 Professional Button Destroyer',
    cupcake: '🏆 Potato Brain Survivor'
  };

  if (achievementLine) {
    achievementLine.textContent = map[choice] || '🏆 Certified Drama Queen';
  }
}

function startLoadingSequence() {
  loadingTitle.textContent = 'Searching...';
  loadingText.textContent = 'Searching...';
  loadingNext.classList.add('hidden');
  clearInterval(loadingTimer);

  const steps = [
    'Searching...',
    'Finding brain...',
    'Loading friendship...',
    'Wait...',
    'Checking your emotional damage...',
    'Loading common sense...',
    'ERROR 404.'
  ];

  let stepIndex = 0;
  loadingTimer = window.setInterval(() => {
    const text = steps[stepIndex % steps.length] || '...';
    loadingTitle.textContent = text;
    loadingText.textContent = text;
    stepIndex += 1;

    if (stepIndex === 4) {
      showJudgeNote('😒 Seriously? You are making me do this.', 'annoyed');
    }

    if (stepIndex === 6) {
      showJudgeNote('🤨 Wait... that felt suspicious.', 'suspicious');
    }
  }, 700);

  window.setTimeout(() => {
    window.clearInterval(loadingTimer);
    const playerName = (nameInput?.value || '').trim() || 'Mysterious Disaster';
    loadingTitle.textContent = 'Oh.';
    loadingText.innerHTML = `It's YOU.<br><span>${playerName}.</span>`;
    loadingNext.classList.remove('hidden');
    showJudgeNote('😂 HAHAHA... yes. It is you. The chaos has a face.', 'funny');
  }, 3200);
}

function spawnConfetti() {
  const colors = ['#ff6fa8', '#ffd166', '#7ed6ff', '#b388ff', '#ff9f1c'];
  for (let i = 0; i < 24; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 4000);
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const target = button.getAttribute('data-target');
  if (!target) return;

  if (button.id === 'play-again') {
    if (nameInput) {
      nameInput.value = '';
    }
    if (achievementLine) {
      achievementLine.textContent = '';
    }
    usedJokes = new Set();
  }

  if (button.classList.contains('option-btn')) {
    const reaction = button.getAttribute('data-reaction');
    const picked = pickUniqueReaction(reaction);
    assignAchievement(reaction);
    setScreenText(target, picked.heading, picked.lineOne, picked.lineTwo);
    showJudgeNote(picked.note, picked.mood);

    if (reaction === 'pizza' && Math.random() < 0.5) {
      window.setTimeout(() => {
        showJudgeNote('💀 Never mind... forget I said that.', 'funny');
      }, 900);
    }

    if (reaction === 'nap' && Math.random() < 0.5) {
      window.setTimeout(() => {
        showJudgeNote('😴 I was going to be dramatic... but I got sleepy.', 'annoyed');
      }, 900);
    }

    if (Math.random() < 0.25) {
      window.setTimeout(() => {
        showJudgeNote('😈 I know where you are... probably in front of your computer.', 'creepy');
      }, 1400);
    }

    showScreen(target);
    return;
  }

  if (button.getAttribute('data-action') === 'continue') {
    const name = nameInput.value.trim() || 'Mysterious Disaster';
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '');
    showJudgeNote(`😏 "${cleanName}"? That is either brave or deeply cursed.`, 'funny');
    if (Math.random() < 0.35) {
      window.setTimeout(() => {
        showJudgeNote('🤨 Wait... are you alone right now?', 'suspicious');
        window.setTimeout(() => {
          showJudgeNote('Relax. I am just messing with you.', 'funny');
        }, 1200);
      }, 700);
    }
    showScreen(target);
    return;
  }

  if (button.getAttribute('data-target') === 'screen-welcome' && button.id !== 'play-again') {
    showJudgeNote('😂 HAHAHA... you came back. Brave. Stupid. Brave.', 'funny');
  }

  if (button.getAttribute('data-target') === 'screen-name' || button.getAttribute('data-target') === 'screen-question-1' || button.getAttribute('data-target') === 'screen-question-2' || button.getAttribute('data-target') === 'screen-question-3') {
    showJudgeNote('😒 Fine. But I am judging you the whole time.', 'annoyed');
  }

  showScreen(target);
});

showScreen('screen-welcome');
showJudgeNote('😂 Welcome. Try not to embarrass yourself immediately.', 'funny');
