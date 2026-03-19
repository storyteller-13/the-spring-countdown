const term = document.getElementById("term");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const countdownEl = document.getElementById("countdown");
const controlsEl = document.getElementById("controls");
const titleTextEl = document.getElementById("titleText");

async function loadContentText() {
  const res = await fetch("/data/content.json");
  if (!res.ok) {
    throw new Error(`Failed to fetch /data/content.json: HTTP ${res.status}`);
  }
  const content = await res.json();
  document.title = content.page_title ?? "";
  if (titleTextEl) {
    titleTextEl.textContent = content.header_title ?? "";
  }
  if (countdownEl && content.countdown_aria_label) {
    countdownEl.setAttribute("aria-label", content.countdown_aria_label);
  }
  if (term && content.terminal_aria_label) {
    term.setAttribute("aria-label", content.terminal_aria_label);
  }
  if (input && content.input_placeholder) {
    input.setAttribute("placeholder", content.input_placeholder);
  }
  if (sendBtn) {
    sendBtn.textContent = content.send_button_label ?? "";
  }
}

function append(text) {
  term.textContent += text;
  term.scrollTop = term.scrollHeight;
}

function formatCountdown(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad2 = (n) => String(n).padStart(2, "0");
  return `${days}d : ${pad2(hours)}h : ${pad2(minutes)}m : ${pad2(seconds)}s`;
}

function updateCountdown() {
  function getTimeZoneOffsetMillis(timeZone, date) {

    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(date);
    const values = {};
    for (const p of parts) {
      if (p.type !== "literal") values[p.type] = p.value;
    }
    const asUTC = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      Number(values.second)
    );
    return asUTC - date.getTime();
  }

  function makeDenverDate(year, monthIndex, day, hour, minute, second) {
    const timeZone = "America/Denver";
    const wallMillis = Date.UTC(year, monthIndex, day, hour, minute, second);
    let utcMillis = wallMillis;
    for (let i = 0; i < 3; i++) {
      const offset = getTimeZoneOffsetMillis(timeZone, new Date(utcMillis));
      utcMillis = wallMillis - offset;
    }
    return new Date(utcMillis);
  }

  const target = makeDenverDate(2026, 2, 20, 14, 0, 0);
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    countdownEl.textContent = "0d : 00h : 00m : 00s";
    return;
  }
  countdownEl.textContent = formatCountdown(diff);
}

try {
  updateCountdown();
  setInterval(updateCountdown, 1000);
} catch (e) {
}

const CLI_MIN_COLS = 80;

const FIND_GIRL_BANNER = `
__________                       .____                       
\__    ___/______ __ __   ____    |    |    _______  __ ____  
  |    |  \\_  __ \\  |  \\_/ __ \\  |    |   /  _ \\  \\/ // __ \\ 
  |    |   |  | \\/  |  /\\  ___/  |    |__(  <_> )   /\\  ___/ 
  |____|   |__|  |____/  \\___ >  |_______ \\____/ \\_/  \\___ >

`.trimEnd().split("\n").map((l) => l.replace(/\s+$/, "")).join("\n");

const FIND_GIRL_BANNER_END = `
  ________                        ________                     
 /  _____/_____    _____   ____   \\_____  \\___  __ ___________ 
/   \\  ___\\__  \\  /     \\_/ __ \\   /   |   \\  \\/ // __ \\_  __ \\
\\    \\_\\  \\/ __ \\|  Y Y  \\  ___/  /    |    \\   /\\  ___/|  | \\/
 \\______  (____  /__|_|  /\\___  > \\_______  /\\_/  \\___  >__|   
  \\/     \\/      \\/     \\/          \\/          \\/       
`.trimEnd();

const FIRST_CHALLENGE_CELEBRATION = `
+--------------------------------------------------+
|     CONGRATULATIONS! FIRST CHALLENGE PASSED!     |
|        THE PRINCESS IS ONE STEP CLOSER...        |
+--------------------------------------------------+
          *             *           
    *            *             * 
 *     *  FIREWORKS MODE!   *     *
    *            *             * 
       .    .    .    .    . 
          *     YAYY    *
            .        .  
                 .   
`.trimEnd();

const SECOND_CHALLENGE_CELEBRATION = `
+--------------------------------------------------+
|   CONGRATULATIONS! TRUE LOVE TEST PASSED!        |
|         THE PRINCESS SMILES FROM AFAR!           |
+--------------------------------------------------+
          *             *           
    *            *            * 
 *     *     COZY MODE!    *     *
    *            *            * 
       .    .    .    .    . 
          *     YUMMY    *
            .        .  
                 .   
`.trimEnd();

const THIRD_CHALLENGE_CELEBRATION = `
+--------------------------------------------------+
|     CONGRATULATIONS! CHALLENGE 3 PASSED!         |
|     THE ODDS OF FAITH ARE IN YOUR FAVOR.         |
+--------------------------------------------------+
        *             *           
  *            *             * 
*    *   2 4 6 9 10 13 !  *     *
  *            *             * 
      .    .    .    .    .
           *   444   *
                . 
`.trimEnd();

let ROLL_DICE_INTRO_POEM = "if you’re going to try, go all the way. otherwise, don’t even start.\n";
ROLL_DICE_INTRO_POEM += "this could mean losing girlfriends, friends, relatives, jobs and maybe your mind.\n";
ROLL_DICE_INTRO_POEM += "go all the way. \n\n";
ROLL_DICE_INTRO_POEM += "it could mean not eating for 3 or 4 days.\n";
ROLL_DICE_INTRO_POEM += "it could mean freezing on a park bench.\n";
ROLL_DICE_INTRO_POEM += "it could mean jail, it could mean derision, mockery, isolation.\n";
ROLL_DICE_INTRO_POEM += "isolation is the gift, all the others are a test of your endurance\n";
ROLL_DICE_INTRO_POEM += "of how much you really want to do it.\n";
ROLL_DICE_INTRO_POEM += "and you’ll do it despite rejection and the worst odds.\n";
ROLL_DICE_INTRO_POEM += "and it will be better than anything else you can imagine.\n\n";
ROLL_DICE_INTRO_POEM += "if you’re going to try, go all the way. there is no other feeling like that.\n";
ROLL_DICE_INTRO_POEM += "you will be alone with the gods and the nights will flame with fire.\n";
ROLL_DICE_INTRO_POEM += "do it, do it, do it. do it. all the way. all the way.\n";
ROLL_DICE_INTRO_POEM += "you will ride life straight to perfect laughter,\n";
ROLL_DICE_INTRO_POEM += "it’s the only good fight there is.\n";

function clearScreen() {
}

function displayWidth(str) {
  let w = 0;
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (
      cp >= 0x1100 && (
        cp <= 0x115f ||
        cp === 0x2329 || cp === 0x232a ||
        (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
        (cp >= 0xac00 && cp <= 0xd7a3) ||
        (cp >= 0xf900 && cp <= 0xfaff) ||
        (cp >= 0xfe10 && cp <= 0xfe19) ||
        (cp >= 0xfe30 && cp <= 0xfe6f) ||
        (cp >= 0xff00 && cp <= 0xff60) ||
        (cp >= 0xffe0 && cp <= 0xffe6) ||
        (cp >= 0x1f300 && cp <= 0x1f64f) ||
        (cp >= 0x1f900 && cp <= 0x1f9ff) ||
        (cp >= 0x20000 && cp <= 0x3fffd)
      )
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

function wrapTextSimple(text, width) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const word of words) {
    if (!cur) {
      cur = word;
      continue;
    }
    const next = cur + " " + word;
    if (displayWidth(next) <= width) {
      cur = next;
    } else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function appendWrappedPreserveNewlines(text, width) {
  const rawLines = text.split("\n");
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.trim() !== "") {
      append(wrapTextSimple(line, width).join("\n"));
    }
    if (i !== rawLines.length - 1) append("\n");
  }
}

let inputResolver = null;
function setInputEnabled(enabled) {
  input.disabled = !enabled;
  sendBtn.disabled = !enabled;
  if (enabled) input.focus();
}

function submitInput() {
  if (!inputResolver) return;
  const v = input.value ?? "";
  input.value = "";
  append(v + "\n");
  const resolve = inputResolver;
  inputResolver = null;
  setInputEnabled(false);
  resolve(v);
}

sendBtn.addEventListener("click", () => submitInput());
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitInput();
  }
});

function waitForLine() {
  return new Promise((resolve) => {
    inputResolver = resolve;
    setInputEnabled(true);
  });
}

async function promptLine(promptText) {
  append(promptText);
  const v = await waitForLine();
  return v;
}

async function askYesNo(promptText) {
  while (true) {
    const raw = (await promptLine(promptText)).trim().toLowerCase();
    if (raw === "y" || raw === "yes") return true;
    if (raw === "n" || raw === "no") return false;
    append("Please enter 'y' or 'n'.\n");
  }
}

async function askInt(promptText, validMin, validMax) {
  while (true) {
    const raw = (await promptLine(promptText)).trim();
    if (!/^-?\d+$/.test(raw)) {
      append("Please enter a number.\n");
      continue;
    }
    const n = Number.parseInt(raw, 10);
    if (n < validMin || n > validMax) {
      append(`Enter a number between ${validMin} and ${validMax}.\n`);
      continue;
    }
    return n;
  }
}

async function askChoice(promptText, choices) {
  append(promptText + "\n");
  for (let i = 0; i < choices.length; i++) {
    append(`  ${i + 1}. ${choices[i]}\n`);
  }
  const idx = await askInt("\nYour choice? ", 1, choices.length);
  return idx - 1;
}

async function pause(message, afterNewlines = 0) {
  append(message);
  await waitForLine();
  if (afterNewlines > 0) append("\n".repeat(afterNewlines));
}

async function runMultipleChoiceQuiz(questions, passMark, celebrationOnPass, failMessage) {
  let correct = 0;
  for (let qI = 0; qI < questions.length; qI++) {
    const q = questions[qI];
    const qNum = qI + 1;
    if (qNum === 1) {
      append("\n");
      while (!(await askYesNo("Are you ready (y/n)?\n\n "))) {
        append("No rush. Press y when you're ready.\n");
      }
    }

    append(`\nQ${qNum}: ${q.question ?? ""}\n`);
    const answerIndex = await askChoice("", q.choices);

    if (answerIndex === q.answer_index) {
      correct++;
      append("Correct.\n");
    } else {
      append("Not quite.\n");
    }

    const expl = q.explanation;
    if (expl) append(`   ${expl}\n`);

    if (qNum !== questions.length) append("\n");
  }

  const total = questions.length;
  append(`\n\nSCORE: ${correct}/${total} (need ${passMark})\n`);
  if (correct >= passMark) {
    append("\n" + celebrationOnPass + "\n");
    return true;
  }
  append(failMessage + "\n");
  return false;
}

async function runPhiloLit(questions) {
  const quiz = questions.philo_lit_quiz;
  const passMark = Math.max(3, Math.floor(quiz.length / 2) + 0);
  return runMultipleChoiceQuiz(
    quiz,
    passMark,
    FIRST_CHALLENGE_CELEBRATION,
    "You failed... \nBut we heard you are Russian, and Russians are known for their perseverance..."
  );
}

async function runLikesGuess(questions) {
  const qs = questions.likes_guess || questions.true_love_test || [];
  let correct = 0;

  for (const item of qs) {
    const cat = item.category ?? "Category";
    append(`\n\n${cat}\n`);

    const choice = await askChoice(item.question, item.choices);

    let correctIndices = item.correct_indices;
    if (correctIndices == null) correctIndices = item.answer_indices;
    if (correctIndices == null) {
      correctIndices = ("answer_index" in item) ? [item.answer_index] : [];
    }

    if (new Set(correctIndices).has(choice)) {
      correct++;
      append("Yes. She approves from afar.\n");
    } else {
      append("Incorrect. Your vibes are off... Focus!!!\n");
    }

    const expl = item.explanation;
    if (expl) append(`  ${expl}\n`);
  }

  const total = qs.length;
  const passMark = Math.max(0, total - 1);
  append(`\n\nSCORE: ${correct}/${total} (need ${passMark})\n`);
  if (correct >= passMark) {
    append("\n" + SECOND_CHALLENGE_CELEBRATION + "\n");
    return true;
  }
  append("You failed... \nBut we heard you are Russian, and Russians are known for their perseverance...\n");
  return false;
}

async function runTrueLoveTest(questions) {
  return runLikesGuess(questions);
}

async function runRollTheDice() {
  const wantsToRoll = await askYesNo("\n\n🎲 Would you like to roll the dice? (y/n) ");
  if (!wantsToRoll) {
    append("\nNo roll. The gods remain unimpressed.\n");
    return false;
  }

  let rollCount = 0;
  while (true) {
    rollCount++;
    await promptLine(`\nPress Enter to roll (attempt: #${rollCount})...\n`);
    const roll = 1 + Math.floor(Math.random() * 6);

    if (roll === 2 || roll === 4) {
      append(`🤩 Yesss! You rolled: ${roll}.\n`);
      append("\n" + THIRD_CHALLENGE_CELEBRATION + "\n");
      return true;
    }

    append(`\n🙂‍↔️ Nope, you rolled ${roll}. Roll again.\n\n`);
  }
}

async function runInvitation(questions) {
  append(
    "\nThe prince has bravely conquered every quest and he is ready to meet and rescue the princess.\n\n" +
      "He is standing in from of her cave, and he is writing the invitation letter to take her.\n"
  );

  const raw = (await promptLine("\n'Do you accept this date with me?' (y/n)\n\n")).trim();
  if (raw.toLowerCase() !== "y") return false;

  const rawLetterLines = [
    "To My Dearest Goth Princess,",
    "",
    "I have crossed enchanted forests, climbed the tallest mountains, and followed every star in the sky — all leading me here, to you.",
    "",
    "I know the cave has kept you safe, and I would never rush you. But I want you to know that the world outside is warm and wonderful, and it is so much lovelier knowing you are in it.",
    "",
    "So, my darling, whenever you are ready — take one small step toward the light. All you have to do is to take my hand, and I promise I will never let go. I will be waiting for you, right at:",
    "",
    "⏰ [FRIDAY, March 20th at 2PM (First day of Spring'26)]",
    "📍 [DENVER (the exact place will be sent to L's email at 1pm on Friday)]",
    "",
    "No more running. No more darkness. Just the beginning of our story.",
    "",
    "Yours, always and completely, ",
    "The Prince",
  ];

  const maxWidth = 72;
  const letterLines = [];
  for (const line of rawLetterLines) {
    if (line === "") {
      letterLines.push("");
      continue;
    }
    const wrapped = wrapTextSimple(line, maxWidth);
    letterLines.push(...(wrapped.length ? wrapped : [line]));
  }

  const width = Math.max(...letterLines.map((l) => displayWidth(l)));
  const topBorder = "+" + "-".repeat(width + 2) + "+";
  append("\n" + topBorder + "\n");

  for (const line of letterLines) {
    let pad = width - displayWidth(line);
    if (line.startsWith("📍")) pad = Math.max(0, pad - 1);
    append("| " + line + " ".repeat(pad) + " |\n");
  }

  append(topBorder + "\n");
  return true;
}

async function runChallengeWithRetries(name, func, state, retries) {
  const introTextMap = {
    "1: Philosophy and Literature Quiz":
      "Having endured so much, the prince must prove his worth and wisdom before he can truly rescue and love the princess — for her mind runs deep, and she needs a partner who does too. \n\nOnly someone who genuinely grasps the weight of the human condition will be fit to stand beside her; someone she can have the kind of soul-stirring conversations with that will sustain them through all the years of world-saving to come.\n",
    "2:    The True Love Test         ":
      "Assured in his knowledge of the humanities and literature, the prince has no doubt he will captivate the princess. \n\nHe turns his mind now to the art of courtship, approaching it with the grace and refinement of a true nobleman.\n",
    "3: roll the dice": ROLL_DICE_INTRO_POEM,
    "3:       Roll the Dice           ": ROLL_DICE_INTRO_POEM,
  };

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    clearScreen();
    append(
      `===================================================\n` +
        `===================================================\n` +
        `=== Challenge ${name} ===\n` +
        `===================================================\n` +
        `===================================================\n`
    );

    const introText = introTextMap[name];
    if (introText) {
      append("\n");
      const wrapWidth = CLI_MIN_COLS;
      if (introText.includes("\n")) {
        if (name === "3: roll the dice" || name === "3:       Roll the Dice           ") {
          append(introText);
        } else {
          appendWrappedPreserveNewlines(introText, wrapWidth);
          append("\n");
        }
      } else {
        const wrapped = wrapTextSimple(introText, wrapWidth);
        append(wrapped.join("\n") + "\n");
      }
    }

    if (name === "2:    The True Love Test         ") {
      append("\n");
      while (!(await askYesNo("Are you ready (y/n)?\n\n "))) {
        append("No rush. Press y when you're ready.\n");
      }
    }

    const ok = await func(state);
    if (ok) {
      await pause("\n\nPress Enter to continue...\n\n");
      return true;
    }

    append("\nTry again...\n");
    await pause("Press Enter when ready...\n\n");
  }

  return false;
}

async function bootstrap() {
  try {
    setInputEnabled(false);
    await loadContentText();
    const res = await fetch("/data/questions.json");
    if (!res.ok) {
      throw new Error(`Failed to fetch /data/questions.json: HTTP ${res.status}`);
    }
    const questions = await res.json();

    const state = { meta: { start: new Date().toISOString() }, questions };

    append(FIND_GIRL_BANNER + "\n");
    append(
      "\n\n\nFour trials. One destiny. The princess is waiting — hidden where only the worthy dare to look.\n\n" +
        "The prince sets forth not merely to rescue her, but to become worthy of her love, conquering \n" +
        "every challenge until each victory unlocks the secret that brings him closer. \n\n" +
        "He will not stop until glory and destiny meet at the same horizon, and the greatest chapter of his \n" +
        "story finally begins: with her.\n"
    );
    await pause("\n\n\nPress Enter to accept the challenge...", 3);

    const challenges = [
      ["1: Philosophy and Literature Quiz", (s) => runPhiloLit(s.questions)],
      ["2:    The True Love Test         ", (s) => runTrueLoveTest(s.questions)],
      ["3:       Roll the Dice           ", (s) => runRollTheDice(s.questions)],
      ["4:       The Invitation          ", (s) => runInvitation(s.questions)],
    ];

    for (const [name, fn] of challenges) {
      const ok = await runChallengeWithRetries(name, fn, state, 1);
      if (!ok) {
        clearScreen();
        append(FIND_GIRL_BANNER + "\n");
        append("The quest fails. But hey, goths always have another timeline.\n");
        await pause("\nPress Enter to exit...");
        return;
      }
    }

    clearScreen();
    append(FIND_GIRL_BANNER_END + "\n");
    append("\n\n\n\n\nThe goth princess looks at the prince like the night finally makes sense.\n");
    append("\nThe prince finds his dream girl. He wins the game of life.\n\n");
    append("\nIt's a new moon. Love prevails.");
    append("\n\n'The clock still ticks, but for once, it ticks with you.'\n\n");
    append("\n\n<3\n\n");
  } catch (e) {
    setInputEnabled(true);
    const msg = e instanceof Error ? e.message : String(e);
    append("\n\nError starting the game.\n" + msg + "\n");
  }
}

bootstrap();
