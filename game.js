/* Wordle for Maybaah's Arcade.
   Daily word is deterministic (same for every visitor); practice picks random.
   Any real five-letter word is accepted as a guess; the answer list is
   curated so the hidden word is always common. */
(function () {
  "use strict";

  var ANSWERS = ("abide about above abuse actor acute admit adobe adopt adult after again agent agile agree ahead " +
    "alarm album alert alien align alike alive allow alone along aloud alpha altar alter amber amend among ample " +
    "angel anger angle angry ankle apart apple apply apron arena argue arise armor aroma array arrow aside asset " +
    "atlas audio audit avoid awake award aware awful bacon badge bagel baker banjo basic basil basin batch beach " +
    "beard beast began begin being belly below bench berry birth black blade blame bland blank blast blaze bleak " +
    "blend bless blind blink bliss block bloom blown bluff blunt blush board boast bonus boost booth bound brain " +
    "brake brand brave bread break breed brick bride brief bring brink brisk broad broke brook broom brown brush " +
    "buddy budge build built bulky bunch bunny burst buyer cabin cable cache camel candy canoe cargo carry carve " +
    "catch cause cedar chain chair chalk charm chart chase cheap check cheek cheer chess chest chief child chill " +
    "chime choir choke chord chose chunk churn cider cigar civic civil claim clamp clash clasp class clean clear " +
    "clerk click cliff climb cling cloak clock clone close cloth cloud clout clown coach coast cobra cocoa colon " +
    "color comet comic coral couch cough could count court cover crack craft crane crank crash crate crawl crazy " +
    "cream creek creep crepe crest crime crisp cross crowd crown crumb crush crust cubic curly curve cycle daily " +
    "dairy daisy dance dandy dealt debit debut decal decay decor decoy delay delta dense depot depth derby detox " +
    "devil diary digit diner dirty disco ditch diver dizzy dodge dolly donor donut dough dozen draft drain drake " +
    "drama drank dread dream dress dried drift drill drink drive drone drove drown druid dryer dusty dwell eager " +
    "eagle early earth easel eaten ebony eight eject elbow elder elect elite email ember empty enact endow enemy " +
    "enjoy enter entry envoy epoch equal equip erase error essay ethic evade event every evoke exact exile exist " +
    "extra fable facet faint fairy faith false fancy fatal fault favor feast fence ferry fetch fever fiber field " +
    "fiery fifth fifty fight final finch first fjord flair flake flame flash fleet flesh flick fling flint flirt " +
    "float flock flood floor flora floss flour fluid flush flute focal focus foggy force forge forth forty forum " +
    "found frame frank fraud fresh fried front frost frown froze fruit fudge fully funny fuzzy gamer gamma gauge " +
    "gaunt gecko genre ghost giant giddy given giver glade gland glare glass gleam glide globe gloom glory gloss " +
    "glove going goose gorge grace grade grain grand grant grape graph grasp grass grave gravy great greed green " +
    "greet grief grill grind groan groom grove growl grown guard guess guest guide guild gusto habit happy hardy " +
    "harsh haste hasty hatch haunt haven hazel heard heart heavy hedge hefty heist hello hence hobby hoist holly " +
    "honey honor horse hotel hound house hover human humid humor hurry hydra hyena ideal idiom image imply inbox " +
    "index inert infer inner input irony issue ivory jazzy jelly jewel joint jolly judge juice juicy jumbo jumpy " +
    "kayak kebab khaki kiosk kneel knife knock known koala label labor lance large laser latch later laugh layer " +
    "learn lease least leave ledge legal lemon level lever light lilac limit linen liner liver llama lobby local " +
    "lodge lofty logic login loose lorry lower loyal lucid lucky lunar lunch lyric macro magic magma maize major " +
    "mango manor maple march marsh match mayor medal media melon mercy merge merit merry metal meter metro micro " +
    "midst might mimic minor minus mirth model moist money month moose moral motel motif motor motto mound mount " +
    "mourn mouse mouth movie mural music naive nasal nasty naval nerdy nerve never newer newly niche niece night " +
    "ninja ninth noble noise noisy nomad north novel nurse nylon oasis occur ocean offer often olive onion onset " +
    "opera orbit order organ other otter ought ounce outer owner oxide ozone pagan paint panda panel panic paper " +
    "parka party pasta paste patch patio pause peace peach pearl pedal penny perch peril petal phase phone photo " +
    "piano piece pilot pinch pitch pivot pixel pizza place plaid plain plane plank plant plate plaza plead pluck " +
    "plumb plume point polar porch pouch pound power prank press price pride prime print prior prism prize probe " +
    "prone proof prose proud prove proxy prune pulse punch pupil puppy purse quack quake qualm quart queen query " +
    "quest queue quick quiet quill quilt quirk quota quote radar radio rainy raise rally ranch range rapid ratio " +
    "raven reach react ready realm rebel recap refer regal reign relax relay relic remix renew repay reply rerun " +
    "reset resin retro rhyme rider ridge rifle right rigid rinse ripen risky rival river roast robin robot rocky " +
    "rogue roost rotor rough round route royal rugby ruler rumor rural rusty saber salad salsa salty sandy sauce " +
    "sauna savor savvy scale scarf scene scent scoop scope score scout scrap screw scrub sedan seize sense serve " +
    "setup seven shade shady shaft shake shall shame shape share shark sharp shave shawl sheep sheet shelf shell " +
    "shift shine shiny shirt shock shore short shout shove shown shrub shrug sight sigma silky silly since siren " +
    "sixth sixty skate skill skirt skull slate sleek sleep slice slide slope sloth small smart smash smile smoke " +
    "snack snail snake sneak snowy sober solar solid solve sonic sorry sound south space spade spare spark spawn " +
    "speak spear speed spell spend spice spicy spike spine split spoke spoon sport spray spree squad squat stack " +
    "staff stage stain stair stake stale stalk stall stamp stand stare start state steak steal steam steel steep " +
    "steer stern stick stiff still sting stock stole stone stool store storm story stout stove strap straw stray " +
    "strip stuck study stuff stump style sugar suite sunny super surge sushi swamp swarm swear sweat sweep sweet " +
    "swell swift swing swirl sword syrup table taken tally tango tangy taste teach tempo tenor tense tenth thank " +
    "theft their theme there these thick thief thigh thing think third thorn those three threw throb throw thumb " +
    "thump tiara tidal tiger tight timer timid title toast today token tonic topaz topic torch total touch tough " +
    "towel tower toxic trace track trade trail train trait treat trend trial tribe trick troop trout truce truck " +
    "truly trunk trust truth tulip tunic turbo tutor tweed twice twist ultra uncle under undue unify union unite " +
    "unity until upper upset urban usage usher usual utter vague valid valor value valve vapor vault vegan venom " +
    "venue verse video vigor villa vinyl viola viper viral virus visit vista vital vivid vocal vodka vogue voice " +
    "vowel wafer wager wagon waist waltz waste watch water weary weave wedge weird whale wharf wheat wheel where " +
    "which while whisk white whole whose widow width wield windy witch witty woken woman women world worry worse " +
    "worst worth would wound woven wrath wreck wrist write wrong wrote yacht yeast yield young youth zebra zesty").split(" ");

  var EPOCH = Date.UTC(2026, 0, 1);
  var ROWS = 6, COLS = 5;

  /* deterministic order so the daily sequence isn't alphabetical */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var ORDER = ANSWERS.slice();
  (function () {
    var rnd = mulberry32(20260101);
    for (var i = ORDER.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = ORDER[i]; ORDER[i] = ORDER[j]; ORDER[j] = tmp;
    }
  })();

  function dayNumber() {
    var n = new Date();
    return Math.floor((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - EPOCH) / 864e5) + 1;
  }
  function dailyWord() {
    var idx = ((dayNumber() - 1) % ORDER.length + ORDER.length) % ORDER.length;
    return ORDER[idx];
  }

  /* ── state ── */
  var STATE_KEY = "maybaah:wordle:v1";
  var mode = "daily";           // "daily" | "practice"
  var answer = "";
  var guesses = [];             // submitted guesses
  var current = "";
  var over = false;
  var startTs = null;
  var timerId = null;
  var doneMs = null; // final time of a finished daily, kept for submission

  var board = document.getElementById("board");
  var kbd = document.getElementById("kbd");
  var msg = document.getElementById("msg");
  var endbar = document.getElementById("endbar");
  var btnAgain = document.getElementById("btn-again");

  /* ── board / keyboard DOM ── */
  function buildBoard() {
    board.innerHTML = "";
    for (var r = 0; r < ROWS; r++) {
      var row = document.createElement("div");
      row.className = "row";
      for (var c = 0; c < COLS; c++) {
        var t = document.createElement("div");
        t.className = "tile";
        row.appendChild(t);
      }
      board.appendChild(row);
    }
  }

  var KEY_ROWS = ["qwertyuiop", "asdfghjkl", "\nzxcvbnm\b"];
  function buildKbd() {
    kbd.innerHTML = "";
    KEY_ROWS.forEach(function (r) {
      var row = document.createElement("div");
      row.className = "krow";
      r.split("").forEach(function (ch) {
        var k = document.createElement("button");
        if (ch === "\n") { k.textContent = "enter"; k.className = "key wide"; k.dataset.key = "Enter"; }
        else if (ch === "\b") { k.textContent = "⌫"; k.className = "key wide"; k.dataset.key = "Backspace"; }
        else { k.textContent = ch; k.className = "key"; k.dataset.key = ch; }
        k.type = "button";
        row.appendChild(k);
      });
      kbd.appendChild(row);
    });
  }

  /* ── evaluation with duplicate handling ── */
  function evaluate(guess, ans) {
    var res = new Array(COLS).fill("absent");
    var counts = {};
    var i;
    for (i = 0; i < COLS; i++) {
      if (guess[i] === ans[i]) res[i] = "correct";
      else counts[ans[i]] = (counts[ans[i]] || 0) + 1;
    }
    for (i = 0; i < COLS; i++) {
      if (res[i] !== "correct" && counts[guess[i]] > 0) {
        res[i] = "present";
        counts[guess[i]]--;
      }
    }
    return res;
  }

  var KEY_RANK = { absent: 1, present: 2, correct: 3 };
  function paintRow(r, guess, res, instant) {
    var tiles = board.children[r].children;
    for (var c = 0; c < COLS; c++) {
      var tile = tiles[c];
      tile.textContent = guess[c];
      tile.classList.remove("filled");
      tile.classList.add(res[c]);
    }
    guess.split("").forEach(function (ch, idx) {
      var key = kbd.querySelector('[data-key="' + ch + '"]');
      if (!key) return;
      var cur = key.dataset.state;
      if (!cur || KEY_RANK[res[idx]] > KEY_RANK[cur]) {
        key.dataset.state = res[idx];
        key.classList.remove("correct", "present", "absent");
        key.classList.add(res[idx]);
      }
    });
  }

  function paintCurrent() {
    var tiles = board.children[guesses.length].children;
    for (var c = 0; c < COLS; c++) {
      tiles[c].textContent = current[c] || "";
      tiles[c].classList.toggle("filled", !!current[c]);
    }
  }

  /* ── messaging / timer ── */
  var msgT;
  function toast(text, ms) {
    msg.textContent = text;
    msg.classList.add("show");
    clearTimeout(msgT);
    msgT = setTimeout(function () { msg.classList.remove("show"); }, ms || 1600);
  }

  function tick() {
    if (startTs && !over) {
      document.getElementById("s-time").textContent = Arcade.fmtTime(Date.now() - startTs);
    }
  }

  /* ── daily persistence ── */
  function loadDaily() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY)) || null; } catch { return null; }
  }
  function saveDaily() {
    if (mode !== "daily") return;
    localStorage.setItem(STATE_KEY, JSON.stringify({
      day: dayNumber(), guesses: guesses, over: over, startTs: startTs, doneMs: doneMs
    }));
  }

  /* ── game flow ── */
  function newGame(m) {
    mode = m;
    guesses = []; current = ""; over = false; startTs = null; doneMs = null;
    document.getElementById("submit-run").style.display = "none";
    document.getElementById("mode-daily").setAttribute("aria-pressed", String(m === "daily"));
    document.getElementById("mode-practice").setAttribute("aria-pressed", String(m === "practice"));
    document.getElementById("s-day").innerHTML =
      m === "daily" ? "daily <b>#" + dayNumber() + "</b>" : "practice <b>∞</b>";
    document.getElementById("s-time").textContent = "0.0s";
    endbar.classList.remove("show");
    btnAgain.hidden = m === "daily";
    buildBoard();
    buildKbd();

    if (m === "daily") {
      answer = dailyWord();
      var s = loadDaily();
      if (s && s.day === dayNumber()) {
        startTs = s.startTs;
        over = !!s.over;
        doneMs = s.doneMs == null ? null : s.doneMs;
        (s.guesses || []).forEach(function (g) {
          guesses.push(g);
          paintRow(guesses.length - 1, g, evaluate(g, answer), true);
        });
        if (over) {
          finishUI(guesses[guesses.length - 1] === answer, true);
        } else if (startTs) {
          tick();
        }
      }
    } else {
      answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    }
  }

  function finishUI(won, restored) {
    over = true;
    endbar.classList.add("show");
    if (!restored) {
      toast(won ? ["Genius.", "Splendid.", "Nice.", "Close one.", "Phew.", "That was tight."][guesses.length - 1]
                : "It was “" + answer.toUpperCase() + "”", 2600);
    }
    if (doneMs != null) document.getElementById("s-time").textContent = Arcade.fmtTime(doneMs);
    else if (startTs) document.getElementById("s-time").textContent = Arcade.fmtTime(elapsed());
    if (won && mode === "daily") showSubmitUI();
  }

  function elapsed() { return startTs ? Date.now() - startTs : 0; }

  function submit() {
    if (over) return;
    if (current.length < COLS) { rejectRow("Not enough letters"); return; }
    if (!/^[a-z]{5}$/.test(current)) { rejectRow("Letters only"); return; }

    var timeMs = elapsed();
    var res = evaluate(current, answer);
    guesses.push(current);
    paintRow(guesses.length - 1, current, res);
    var won = current === answer;
    current = "";

    if (won || guesses.length === ROWS) {
      over = true;
      doneMs = timeMs;
      Arcade.addScore("wordle", {
        result: won ? "win" : "loss",
        guesses: guesses.length,
        timeMs: timeMs,
        mode: mode,
        day: mode === "daily" ? dayNumber() : null
      });
      finishUI(won);
    }
    saveDaily();
  }

  /* A daily win goes to the global board once the player picks a name, the
     same flow as flowcode's post-run submit. The worker re-checks every
     guess against the real answer before ranking anything. */
  function showSubmitUI() {
    var input = document.getElementById("run-name");
    var stored = Arcade.getPlayer();
    input.value = stored === "player" ? "" : stored;
    document.getElementById("run-status").textContent = "";
    document.getElementById("btn-submit-run").disabled = false;
    document.getElementById("submit-run").style.display = "flex";
  }

  function submitRun() {
    var input = document.getElementById("run-name");
    var status = document.getElementById("run-status");
    var btn = document.getElementById("btn-submit-run");
    var name = input.value.trim();
    if (!name) {
      status.textContent = "enter a name first";
      input.focus();
      return;
    }
    if (!window.Arcade || !Arcade.submit) return;
    Arcade.setPlayer(name);
    btn.disabled = true;
    status.textContent = "verifying…";
    Arcade.submit("wordle", {
      day: dayNumber(),
      guesses: guesses.slice(),
      timeMs: doneMs == null ? 1000 : doneMs
    }).then(function (res) {
      status.textContent = res && res.rank ? "verified, ranked #" + res.rank : "verified";
    }).catch(function (e) {
      status.textContent = e.message || "submission failed";
      btn.disabled = false;
    });
  }

  function rejectRow(text) {
    toast(text);
    var row = board.children[guesses.length];
    row.classList.add("shake");
    setTimeout(function () { row.classList.remove("shake"); }, 450);
  }

  function onKey(key) {
    if (over) return;
    if (key === "Enter") { submit(); return; }
    if (key === "Backspace") { current = current.slice(0, -1); paintCurrent(); return; }
    if (/^[a-z]$/.test(key) && current.length < COLS) {
      if (!startTs) { startTs = Date.now(); saveDaily(); }
      current += key;
      paintCurrent();
    }
  }

  /* ── share ── */
  function shareText() {
    var head = mode === "daily"
      ? "Wordle #" + dayNumber() + " " + (guesses[guesses.length - 1] === answer ? guesses.length : "X") + "/6"
      : "Wordle (practice) " + (guesses[guesses.length - 1] === answer ? guesses.length : "X") + "/6";
    var grid = guesses.map(function (g) {
      return evaluate(g, answer).map(function (s) {
        return s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛";
      }).join("");
    }).join("\n");
    return head + "\n\n" + grid + "\n\nmaybaah.github.io/wordle/";
  }

  /* ── wire up ── */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    var k = e.key;
    if (k === "Enter" || k === "Backspace") { e.preventDefault(); onKey(k); }
    else if (/^[a-zA-Z]$/.test(k)) onKey(k.toLowerCase());
  });
  kbd.addEventListener("click", function (e) {
    var b = e.target.closest("[data-key]");
    if (b) onKey(b.dataset.key);
  });
  document.getElementById("btn-submit-run").addEventListener("click", submitRun);
  document.getElementById("run-name").addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitRun();
  });
  document.getElementById("mode-daily").addEventListener("click", function () { newGame("daily"); });
  document.getElementById("mode-practice").addEventListener("click", function () { newGame("practice"); });
  btnAgain.addEventListener("click", function () { newGame("practice"); });
  document.getElementById("btn-share").addEventListener("click", function () {
    var text = shareText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast("Copied to clipboard"); },
        function () { toast("Couldn't copy, select manually"); }
      );
    } else {
      window.prompt("Copy your result:", text);
    }
  });

  setInterval(tick, 100);
  newGame("daily");
})();
