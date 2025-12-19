/*  File: js/scrabble.js
 *  HW5 - Scrabble (One Line)
 *  Name: Sri Bhargava Dendukuri
 *  Course: COMP 4610 GUI I
 */

let tileBag = [];
let currentWordScore = 0;
let totalScore = 0;

let tileState = {};
let boardOccupancy = {};

const BOARD_LAYOUT = [
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 2, label: "DW" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 2, wordMult: 1, label: "DL" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 2, wordMult: 1, label: "DL" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 2, label: "DW" },
  { letterMult: 1, wordMult: 1, label: "" },
  { letterMult: 1, wordMult: 1, label: "" }
];

$(function () {
  buildBoardRow();
  resetGame();

  $("#submit-word").on("click", submitWord);
  $("#restart-game").on("click", resetGame);
});

/* ---------- Board ---------- */

function buildBoardRow() {
  $("#board").empty();
  boardOccupancy = {};

  BOARD_LAYOUT.forEach((sq, i) => {
    const $square = $("<div>")
      .addClass("board-square")
      .attr("data-index", i)
      .attr("data-letter-mult", sq.letterMult)
      .attr("data-word-mult", sq.wordMult);

    if (sq.label === "DW") {
      $square.css("background", "#f8c8c8")
        .append($("<div>").addClass("bonus-label").text("DOUBLE WORD"));
    } else if (sq.label === "DL") {
      $square.css("background", "#cfefff")
        .append($("<div>").addClass("bonus-label").text("DOUBLE LETTER"));
    }

    $("#board").append($square);
  });

  setupDroppables();
}

/* ---------- Tile Bag ---------- */

function initTileBagFromDistribution() {
  tileBag = [];

  for (const l in ScrabbleTiles) {
    ScrabbleTiles[l]["number-remaining"] =
      ScrabbleTiles[l]["original-distribution"];

    for (let i = 0; i < ScrabbleTiles[l]["original-distribution"]; i++) {
      tileBag.push(l);
    }
  }
}

function drawRandomTile() {
  if (tileBag.length === 0) return null;
  return tileBag.splice(Math.floor(Math.random() * tileBag.length), 1)[0];
}

function tileImagePath(letter) {
  return letter === "_"
    ? "images/tiles/Scrabble_Tile_Blank.jpg"
    : `images/tiles/Scrabble_Tile_${letter}.jpg`;
}

/* ---------- Drag & Drop ---------- */

function setupDraggables() {
  $(".tile").draggable({
    revert: "invalid",
    containment: "document",
    zIndex: 1000
  });
}

function setupDroppables() {
  $(".board-square").droppable({
    tolerance: "intersect",

    accept: function ($tile) {
      const idx = parseInt($(this).attr("data-index"));
      const tileId = $tile.attr("id");

      if (boardOccupancy[idx]) return false;
      if (!isValidAdjacentPlacement(idx, tileId)) return false;
      return true;
    },

    drop: function (event, ui) {
      const idx = parseInt($(this).attr("data-index"));
      const tileId = ui.draggable.attr("id");

      const prev = tileState[tileId];
      if (prev && prev.location === "board") {
        delete boardOccupancy[prev.squareIndex];
      }

      boardOccupancy[idx] = tileId;
      tileState[tileId] = { location: "board", squareIndex: idx };

      ui.draggable.detach().css({ top: 0, left: 0 }).appendTo($(this));
      calculateCurrentWordScore();
    }
  });

  $("#rack").droppable({
    accept: ".tile",
    tolerance: "intersect",

    drop: function (event, ui) {
      const tileId = ui.draggable.attr("id");

      const prev = tileState[tileId];
      if (prev && prev.location === "board") {
        delete boardOccupancy[prev.squareIndex];
      }

      tileState[tileId] = { location: "rack", squareIndex: null };
      ui.draggable.detach().css({ top: 0, left: 0 }).appendTo("#rack");
      calculateCurrentWordScore();
    }
  });
}

/* ---------- Adjacency ---------- */

function isValidAdjacentPlacement(targetIndex, tileId) {
  const occupied = Object.keys(boardOccupancy).map(Number);
  const prev = tileState[tileId];

  const others = occupied.filter(i =>
    !(prev && prev.location === "board" && prev.squareIndex === i)
  );

  if (others.length === 0) return true;
  return others.includes(targetIndex - 1) || others.includes(targetIndex + 1);
}

/* ---------- Scoring ---------- */

function calculateCurrentWordScore() {
  let sum = 0;
  let wordMult = 1;

  $(".board-square").each(function () {
    const $tile = $(this).find(".tile");
    if ($tile.length) {
      sum += parseInt($tile.attr("data-value")) *
             parseInt($(this).attr("data-letter-mult"));
      wordMult *= parseInt($(this).attr("data-word-mult"));
    }
  });

  currentWordScore = sum * wordMult;
  $("#word-score").text(currentWordScore);
}

/* ---------- Extra Credit Validation ---------- */

function getCurrentWord() {
  let w = "";
  $(".board-square").each(function () {
    const t = $(this).find(".tile");
    if (t.length) w += t.attr("data-letter");
  });
  return w;
}

function isValidWord(word) {
  return word.length >= 2 && /^[A-Z]+$/.test(word);
}

/* ---------- Submit / Restart ---------- */

function submitWord() {
  const word = getCurrentWord();
  if (!isValidWord(word)) {
    alert("Invalid word.");
    return;
  }

  totalScore += currentWordScore;
  $("#total-score").text(totalScore);

  // remove only tiles
  Object.values(boardOccupancy).forEach(id => $("#" + id).remove());

  boardOccupancy = {};
  tileState = Object.fromEntries(
    Object.entries(tileState).filter(([_, v]) => v.location === "rack")
  );

  refillRack();
  currentWordScore = 0;
  $("#word-score").text("0");
}

function refillRack() {
  const need = 7 - $("#rack .tile").length;

  for (let i = 0; i < need; i++) {
    const l = drawRandomTile();
    if (!l) break;

    const id = `tile-${Date.now()}-${Math.random()}`;
    const $t = $("<img>")
      .addClass("tile")
      .attr("id", id)
      .attr("data-letter", l)
      .attr("data-value", ScrabbleTiles[l].value)
      .attr("src", tileImagePath(l));

    tileState[id] = { location: "rack", squareIndex: null };
    $("#rack").append($t);
  }

  setupDraggables();
}

function resetGame() {
  totalScore = 0;
  currentWordScore = 0;
  $("#total-score").text("0");
  $("#word-score").text("0");

  tileState = {};
  boardOccupancy = {};

  $("#rack").empty();
  $(".board-square .tile").remove(); // ✅ FIX: DO NOT .empty()

  initTileBagFromDistribution();
  refillRack();
}
