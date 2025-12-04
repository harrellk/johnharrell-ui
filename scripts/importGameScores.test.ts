// scripts/importGameScores.test.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RawScoreRow {
  DATE: string;
  "WINNING TEAM": string;
  WS: string;
  "LOSING TEAM": string;
  LS: string;
  OT: string;
  WN: string;
  LN: string;
}

function normalizeDate(raw: string) {
  if (!raw || typeof raw !== "string") return null;

  const parts = raw.split("/");

  if (parts.length !== 3) return null;

  const [m, d, y] = parts;

  if (!m || !d || !y) return null;

  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

async function run() {
  const filePath = path.join(__dirname, "game_scores.csv");

  console.log("Running DRY RUN (no DB updates)\n");
  console.log("Reading:", filePath);

  const rows: RawScoreRow[] = [];

  await new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: any) => {
        rows.push(row as RawScoreRow);
      })
      .on("end", resolve);
  });

  console.log(`Loaded ${rows.length} raw score rows\n`);

  let matched = 0;
  let unmatched: RawScoreRow[] = [];

  for (const row of rows) {
    const gameDate = normalizeDate(row.DATE);

    if (!gameDate) {
      unmatched.push(row);
      continue;
    }

    const winnerNum = Number(row.WN);
    const loserNum = Number(row.LN);
    const ws = Number(row.WS);
    const ls = Number(row.LS);
    const otCount = Number(row.OT) || 0;

    // --- Find matching game ---
    const { data: matches } = await supabase
      .from("fb_sked")
      .select("id, vtn, htn, visitor, home")
      .eq("game_date", gameDate);

    if (!matches || matches.length === 0) {
      unmatched.push(row);
      continue;
    }

    const game = matches.find(
      (g) =>
        (g.vtn === winnerNum && g.htn === loserNum) ||
        (g.vtn === loserNum && g.htn === winnerNum)
    );

    if (!game) {
      unmatched.push(row);
      continue;
    }

    matched++;

    let vScore, hScore;

    if (game.vtn === winnerNum) {
      vScore = ws;
      hScore = ls;
    } else {
      vScore = ls;
      hScore = ws;
    }

    console.log(
      `MATCH: ${gameDate} → Game ID ${game.id} (${game.visitor} @ ${game.home})`
    );
    console.log(
      `         Visitor=${vScore}, Home=${hScore}, OT=${otCount} (Dry Run)`
    );
    console.log("");
  }

  console.log("\n=== DRY RUN COMPLETE ===");
  console.log(`Matched games: ${matched}`);
  console.log(`Unmatched rows: ${unmatched.length}`);

  // ---- Write unmatched rows to JSON file ----
  const outPath = path.join(__dirname, "unmatched.json");
  fs.writeFileSync(outPath, JSON.stringify(unmatched, null, 2));

  console.log(`\nUnmatched rows written to: ${outPath}\n`);

  if (unmatched.length > 0) {
    console.log("Showing first 20 unmatched rows:");
    console.table(
      unmatched.slice(0, 20).map((u) => ({
        DATE: u.DATE,
        WN: u.WN,
        LN: u.LN,
        WS: u.WS,
        LS: u.LS,
        OT: u.OT,
      }))
    );
  }
}

run();
