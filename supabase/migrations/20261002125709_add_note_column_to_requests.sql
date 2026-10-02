/*
# Add note column to requests table

## Purpose
The Give Clothes form collects an optional note from households (e.g. "kids summer
clothes"). The `requests` table did not have a column to store it, so the note was
silently dropped on insert. This adds the column so the note persists and can be
shown on the Track page receipt.

## Changes
- `requests.note` (text, nullable) — optional household note about the clothes

## Security
- No policy changes needed. The existing anon INSERT/UPDATE policies allow writing
  to all columns, so `note` is automatically covered.
*/

ALTER TABLE requests ADD COLUMN IF NOT EXISTS note text;
