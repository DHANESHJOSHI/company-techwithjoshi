import { MongoClient } from "mongodb";
import fs from "fs";
import { generateServiceDetails } from "../src/lib/ai.js";

const envLines = fs.readFileSync(".env.local", "utf8").split("\n");
const env = {};
envLines.forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
});

for (const [k, v] of Object.entries(env)) {
  process.env[k] = v;
}

async function enrichServices() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const servicesCol = db.collection("services");

  const existing = await servicesCol.find({}).sort({ order: 1 }).toArray();
  console.log(`Found ${existing.length} services to enrich with AI...`);

  for (const s of existing) {
    console.log(`Generating comprehensive AI breakdown for: ${s.title}...`);
    try {
      const aiData = await generateServiceDetails(s.title, s.category || "IT Solutions");
      
      await servicesCol.updateOne(
        { _id: s._id },
        {
          $set: {
            description: aiData.description || s.description,
            features: aiData.features || s.features,
            details: aiData.details || s.details,
            content: aiData.content || s.content,
            aiEnriched: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`✓ Enriched: ${s.title}`);
    } catch (err) {
      console.error(`Failed to enrich ${s.title}:`, err.message);
    }
  }

  console.log("ALL SERVICES ENRICHED WITH TECHWITHJOSHI AI!");
  await client.close();
}

enrichServices().catch(console.error);
