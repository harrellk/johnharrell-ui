// scripts/importGameScores.write.ts
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

  console.log("Running WRITE MODE — scores will be written to the database.\n");
  console.log("Reading:", filePath);

  const rows: RawScoreRow[] = [];

  await new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: any) => rows.push(row as RawScoreRow))
      .on("end", resolve);
  });

  console.log(`Loaded ${rows.length} raw score rows\n`);

  let updated = 0;
  let skipped = 0;
  let unmatched: RawScoreRow[] = [];

  for (const row of rows) {
    // Skip blank junk rows
    if (!row.DATE && row.WN === "0" && row.LN === "0") continue;

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

    // Find matching sked row
    const { data: matches, error: matchError } = await supabase
      .from("fb_sked")
      .select("id, vtn, htn, visitor, home, v_score, h_score, ot_count")
      .eq("game_date", gameDate);

    if (matchError) {
      console.error("Supabase error:", matchError);
      process.exit(1);
    }

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

    // Determine scoring orientation
    let vScore, hScore;
    if (game.vtn === winnerNum) {
      vScore = ws;
      hScore = ls;
    } else {
      vScore = ls;
      hScore = ws;
    }

    // Check for existing scores (avoid overwriting without need)
    const alreadySet =
      game.v_score !== null ||
      game.h_score !== null ||
      (game.ot_count ?? 0) !== 0;

    if (alreadySet) {
      console.log(
        `SKIPPED: Game ${game.id} (${game.visitor} @ ${game.home}) already has scores`
      );
      skipped++;
      continue;
    }

    // Update the database
    const { error: updateError } = await supabase
      .from("fb_sked")
      .update({
        v_score: vScore,
        h_score: hScore,
        ot_count: otCount,
      })
      .eq("id", game.id);

    if (updateError) {
      console.error("Update error:", updateError);
      unmatched.push(row);
      continue;
    }

    updated++;

    console.log(
      `UPDATED: Game ${game.id} (${game.visitor} @ ${game.home}) — V=${vScore}, H=${hScore}, OT=${otCount}`
    );
  }

  console.log("\n=== WRITE MODE COMPLETE ===");
  console.log(`Scores updated: ${updated}`);
  console.log(`Skipped (already had scores): ${skipped}`);
  console.log(`Unmatched rows: ${unmatched.length}`);

  if (unmatched.length > 0) {
    const outPath = path.join(__dirname, "unmatched_write_mode.json");
    fs.writeFileSync(outPath, JSON.stringify(unmatched, null, 2));
    console.log(`Unmatched rows written to: ${outPath}`);
  }
}

run();
