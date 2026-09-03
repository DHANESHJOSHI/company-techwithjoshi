import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

const DEFAULT_TESTIMONIALS = [
  {
    name: "David Sterling",
    designation: "VP of Engineering",
    company: "AuraTech Global",
    review: "TechWithJoshi re-architected our legacy stack into high-concurrency microservices with zero downtime. Their technical speed and AI expertise are unmatched.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-01.png",
    order: 1
  },
  {
    name: "Elena Rostova",
    designation: "Chief Product Officer",
    company: "Nexus AI Labs",
    review: "From conceptual wireframing to production deployment, Dhanesh and his engineering team delivered our Next.js platform two weeks ahead of schedule.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-02.png",
    order: 2
  },
  {
    name: "Rajesh Nair",
    designation: "Founder & CEO",
    company: "CloudVenture Inc.",
    review: "The level of engineering rigor TechWithJoshi brings to cloud infrastructure and automated CI/CD pipelines saved us over 40% in AWS infrastructure costs.",
    rating: 5,
    avatar: "assets/img/home-3/h3-testi-03.png",
    order: 3
  }
];

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const testCol = db.collection("testimonials");

    if (req.method === "GET") {
      const admin = getAdminFromRequest(req);
      const isIncludeAll = req.query.includeAll === "true" && !!admin;

      const query = isIncludeAll
        ? {}
        : {
            rating: { $gte: 4 },
            published: { $ne: false }
          };

      let tests = await testCol.find(query).sort({ order: 1, createdAt: -1 }).toArray();
      if (!tests || tests.length === 0) {
        // Fallback check if collection is empty
        const count = await testCol.countDocuments();
        if (count === 0) {
          const docsToInsert = DEFAULT_TESTIMONIALS.map((t) => ({ ...t, published: true, createdAt: new Date(), updatedAt: new Date() }));
          await testCol.insertMany(docsToInsert);
          tests = await testCol.find(query).sort({ order: 1, createdAt: -1 }).toArray();
        }
      }
      return res.status(200).json(tests);
    }

    // Public Review Submission or Admin Management
    if (req.method === "POST") {
      const admin = getAdminFromRequest(req);
      const { name, designation, company, review, rating, avatar, initial, color, order, source, googleReviewUrl } = req.body;
      if (!name || !review) return res.status(400).json({ error: "Name and review text are required" });

      const numRating = rating ? parseInt(rating) : 5;
      const isHighRating = numRating >= 4;

      const newTestimonial = {
        name: name.trim(),
        designation: designation ? designation.trim() : (admin ? "Client" : "Verified Client"),
        company: company ? company.trim() : "",
        review: review.trim(),
        rating: Math.max(1, Math.min(5, numRating)),
        avatar: avatar || "",
        initial: initial || (name.trim() ? name.trim()[0].toUpperCase() : "C"),
        color: color || (numRating === 5 ? "#10B981" : "#3B82F6"),
        order: order ? parseInt(order) : 99,
        source: source || (admin ? "native" : "client_submitted"),
        badge: source === "google" ? "VERIFIED GOOGLE REVIEW" : "VERIFIED CLIENT",
        googleReviewUrl: googleReviewUrl || "https://g.page/r/CdT43EVp0u6bEBM/review",
        published: admin ? true : isHighRating, // 4-5 stars published automatically; 1-3 stars held for private review
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin ? admin.username : "public_client_submission"
      };

      const result = await testCol.insertOne(newTestimonial);
      return res.status(201).json({
        success: true,
        id: result.insertedId,
        data: newTestimonial,
        isHighRating,
        googleReviewUrl: "https://g.page/r/CdT43EVp0u6bEBM/review"
      });
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const targetId = _id || id;
      if (!targetId) return res.status(400).json({ error: "Testimonial ID required" });

      await testCol.updateOne(
        { _id: new ObjectId(targetId) },
        { $set: { ...updateData, updatedAt: new Date(), updatedBy: admin.username } }
      );
      return res.status(200).json({ success: true, message: "Testimonial updated" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Testimonial ID required" });
      await testCol.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "Testimonial deleted" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/testimonials error:", error);
    return res.status(500).json({ error: error.message });
  }
}
