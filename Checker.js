"use strict";

const fs = require("fs");
const notifier = require("node-notifier");

// ---------- config ----------
const CONFIG = {
  inputFile: "users.txt",
  availableFile: "available.txt",
  unavailableFile: "unavailable.txt",
  delayMs: 2000,
  apiBaseUrl: "https://api.hystale.com/",
  appName: "Hystale Checker",
};

// ---------- tiny utilities ----------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function notify(title, message) {
  notifier.notify({ title, message, sound: true });
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function readLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function appendLine(filePath, line) {
  fs.appendFileSync(filePath, `${line}\n`);
}

function loadNormalizedSet(filePath) {
  return new Set(readLines(filePath).map(normalize));
}

function isRateLimited(statusCode, bodyText) {
  const body = normalize(bodyText);
  return (
    statusCode === 429 ||
    body.includes("rate") ||
    body.includes("limit") ||
    body.includes("too many") ||
    body.includes("blocked")
  );
}

// ---------- io ----------
const available = loadNormalizedSet(CONFIG.availableFile);
const unavailable = loadNormalizedSet(CONFIG.unavailableFile);
const usernames = readLines(CONFIG.inputFile);

// ---------- http ----------
async function fetchUsernameStatus(username) {
  const url = `${CONFIG.apiBaseUrl}?username=${encodeURIComponent(username)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
    },
  });

  const body = await res.text().catch(() => "");
  return { status: res.status, body };
}

// ---------- main logic ----------
async function checkUsername(username) {
  const key = normalize(username);

  if (available.has(key) || unavailable.has(key)) {
    console.log(`${username} > Duplicate`);
    return;
  }

  const { status, body } = await fetchUsernameStatus(username);

  if (isRateLimited(status, body)) {
    console.log(`${username} > Rate Limited`);
    notify(CONFIG.appName, "Rate limit hit — script stopped");
    process.exit(1);
  }

  if (status === 200) {
    console.log(`${username} > Available > 200`);
    appendLine(CONFIG.availableFile, username);
    available.add(key);
    notify("Username Available!", username);
    return;
  }

  console.log(`${username} > Unavailable > ${status}`);
  appendLine(CONFIG.unavailableFile, username);
  unavailable.add(key);
}

async function run() {
  if (usernames.length === 0) {
    console.log(`No usernames found in ${CONFIG.inputFile}`);
    return;
  }

  for (const username of usernames) {
    try {
      await checkUsername(username);
    } catch (err) {
      console.log(`${username} > Unavailable > Error`);
      // (optional) console.error(err);
    }

    await sleep(CONFIG.delayMs);
  }

  notify(CONFIG.appName, "Finished checking usernames");
  console.log("\nDone.");
}

run();

