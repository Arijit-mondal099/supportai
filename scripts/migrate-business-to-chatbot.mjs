/**
 * One-off migration: Business (one-per-user) -> Chatbot + Account (multi-bot model).
 *
 * Each legacy `businesses` document becomes:
 *   - one `accounts` document per owner (carries the account-level Gemini apiKey)
 *   - one `chatbots` document (status "live"), tagged with `migratedFrom` for idempotency
 *
 * Safe to run multiple times — already-migrated businesses are skipped.
 *
 * Run with Node 20+ (loads .env.local for MONGODB_URI):
 *   node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "MONGODB_URI is not set.\nRun: node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs",
  );
  process.exit(1);
}

const APPEARANCE_DEFAULTS = {
  accentColor: "#e8440a",
  avatarUrl: "",
  displayName: "Support Agent",
  welcomeMessage: "Hello! How can I assist you today?",
};

const run = async () => {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const businesses = await db.collection("businesses").find({}).toArray();
  console.log(`Found ${businesses.length} business document(s).`);

  let accountsCreated = 0;
  let botsCreated = 0;
  let skipped = 0;

  for (const b of businesses) {
    // One account per owner — carries the shared API key.
    const accRes = await db.collection("accounts").updateOne(
      { ownerId: b.ownerId },
      {
        $setOnInsert: {
          ownerId: b.ownerId,
          email: b.supportEmail ?? "",
          apiKey: b.apiKey ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    if (accRes.upsertedCount) accountsCreated++;

    // Skip if this business has already been migrated into a chatbot.
    const already = await db.collection("chatbots").findOne({ migratedFrom: b._id });
    if (already) {
      skipped++;
      continue;
    }

    await db.collection("chatbots").insertOne({
      ownerId: b.ownerId,
      name: b.botInfo?.botName || "Untitled chatbot",
      status: "live",
      supportEmail: b.supportEmail ?? "",
      provider: "gemini",
      apiKeyOverride: b.apiKey ?? "",
      businessInfo: b.businessInfo ?? { businessName: "", industry: "", description: "" },
      botInfo: b.botInfo ?? {
        botName: "",
        communicationTone: "",
        personalityDescription: "",
      },
      appearance: { ...APPEARANCE_DEFAULTS },
      knowledge: b.knowledge ?? "",
      migratedFrom: b._id,
      createdAt: b.createdAt ?? new Date(),
      updatedAt: b.updatedAt ?? new Date(),
    });
    botsCreated++;
  }

  console.log(
    `Done. Accounts created: ${accountsCreated}, Chatbots created: ${botsCreated}, Skipped (already migrated): ${skipped}.`,
  );
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
