import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const GOOGLE_PLACE_ID = "ChIJEVBKyPwdYTkR1PjcRWnS7ps";
const GOOGLE_REVIEW_URL = "https://g.page/r/CdT43EVp0u6bEBM/review";

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const testCol = db.collection("testimonials");

    // GET /api/google-reviews - Returns Google review stats & triggers API sync if requested
    if (req.method === "GET") {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY || req.query.apiKey;
      let syncResult = null;

      // If sync requested and API key is available
      if (req.query.sync === "true" && apiKey) {
        try {
          const gUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
          const gRes = await fetch(gUrl);
          const gData = await gRes.json();

          if (gData.status === "OK" && gData.result?.reviews) {
            let importedCount = 0;
            for (const r of gData.result.reviews) {
              // ONLY sync 4-star and 5-star reviews!
              if (r.rating >= 4) {
                const existing = await testCol.findOne({
                  $or: [
                    { googleReviewAuthor: r.author_name, review: r.text },
                    { name: r.author_name, source: "google" }
                  ]
                });

                if (!existing) {
                  await testCol.insertOne({
                    name: r.author_name,
                    designation: "Google Reviewer",
                    company: "Google Verified Review",
                    review: r.text,
                    rating: r.rating,
                    avatar: r.profile_photo_url || "",
                    initial: r.author_name ? r.author_name[0].toUpperCase() : "G",
                    color: r.rating === 5 ? "#10B981" : "#3B82F6",
                    source: "google",
                    badge: "VERIFIED GOOGLE REVIEW",
                    googleReviewUrl: GOOGLE_REVIEW_URL,
                    googleReviewAuthor: r.author_name,
                    googleRating: r.rating,
                    published: true,
                    order: 10,
                    createdAt: r.time ? new Date(r.time * 1000) : new Date(),
                    updatedAt: new Date()
                  });
                  importedCount++;
                }
              }
            }
            syncResult = { success: true, importedCount, totalInGoogle: gData.result.reviews.length };
          } else {
            syncResult = { success: false, status: gData.status, error: gData.error_message };
          }
        } catch (apiErr) {
          syncResult = { success: false, error: apiErr.message };
        }
      }

      // Query current 4-5 star Google reviews stored in MongoDB
      const googleReviews = await testCol.find({
        source: "google",
        rating: { $gte: 4 },
        published: { $ne: false }
      }).sort({ createdAt: -1 }).toArray();

      return res.status(200).json({
        placeId: GOOGLE_PLACE_ID,
        reviewUrl: GOOGLE_REVIEW_URL,
        count: googleReviews.length,
        rating: 5.0,
        syncResult,
        reviews: googleReviews
      });
    }

    // POST /api/google-reviews - Admin manual import or Webhook
    if (req.method === "POST") {
      const admin = getAdminFromRequest(req);
      if (!admin) {
        return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
      }

      const { name, review, rating, designation, initial, color } = req.body;
      if (!name || !review) {
        return res.status(400).json({ error: "Author name and review text are required" });
      }

      const numRating = rating ? parseInt(rating) : 5;
      if (numRating < 4) {
        return res.status(400).json({ error: "Only 4-star and 5-star Google reviews can be synced/published" });
      }

      const newGoogleReview = {
        name: name.trim(),
        designation: designation ? designation.trim() : "Google Reviewer",
        company: "Google Verified Review",
        review: review.trim(),
        rating: numRating,
        avatar: "",
        initial: initial || (name.trim() ? name.trim()[0].toUpperCase() : "G"),
        color: color || (numRating === 5 ? "#10B981" : "#3B82F6"),
        source: "google",
        badge: "VERIFIED GOOGLE REVIEW",
        googleReviewUrl: GOOGLE_REVIEW_URL,
        published: true,
        order: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin.username
      };

      const result = await testCol.insertOne(newGoogleReview);
      return res.status(201).json({
        success: true,
        id: result.insertedId,
        data: newGoogleReview
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/google-reviews error:", error);
    return res.status(500).json({ error: error.message });
  }
}
