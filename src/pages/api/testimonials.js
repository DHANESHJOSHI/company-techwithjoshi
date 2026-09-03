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
      let tests = await testCol.find({}).sort({ order: 1 }).toArray();
      if (!tests || tests.length === 0) {
        const docsToInsert = DEFAULT_TESTIMONIALS.map((t) => ({ ...t, createdAt: new Date(), updatedAt: new Date() }));
        await testCol.insertMany(docsToInsert);
        tests = await testCol.find({}).sort({ order: 1 }).toArray();
      }
      return res.status(200).json(tests);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const { name, designation, company, review, rating, avatar, order } = req.body;
      if (!name || !review) return res.status(400).json({ error: "Name and review required" });

      const newTestimonial = {
        name,
        designation: designation || "Client",
        company: company || "",
        review,
        rating: rating ? parseInt(rating) : 5,
        avatar: avatar || "assets/img/home-3/h3-testi-01.png",
        order: order ? parseInt(order) : 99,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: admin.username,
      };

      const result = await testCol.insertOne(newTestimonial);
      return res.status(201).json({ success: true, id: result.insertedId, data: newTestimonial });
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
