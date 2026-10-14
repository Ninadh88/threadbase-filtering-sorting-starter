import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search ?? "").trim();
    const sort = req.query.sort;

    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    const threads = await prisma.thread.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;