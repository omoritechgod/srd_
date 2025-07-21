// pages/api/testimonials/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { handleFileUpload, deleteFile } from '../../../utils/upload';
import nextConnect from 'next-connect';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ message: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` });
  },
});

// GET approved testimonials (Public)
/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all approved testimonials
 *     tags:
 *       - Testimonials
 *     responses:
 *       200:
 *         description: A list of approved testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 *       500:
 *         description: Internal server error
 */
apiRoute.get(async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// POST submit new testimonial (Public)
/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Submit a new testimonial
 *     tags:
 *       - Testimonials
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - text
 *             properties:
 *               name:
 *                 type: string
 *               org:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 maximum: 5
 *               text:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testimonial submitted successfully (awaiting approval)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Testimonial'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
apiRoute.post(handleFileUpload('photo'), async (req: any, res: NextApiResponse) => {
  const { name, org, rating, text } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !text) {
    if (photoUrl) await deleteFile(photoUrl);
    return res.status(400).json({ message: 'Name and testimonial text are required.' });
  }

  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        org,
        rating: rating ? parseInt(rating) : null,
        text,
        photo: photoUrl,
        approved: false, // New testimonials await admin approval
      },
    });
    res.status(201).json(newTestimonial);
  } catch (error: any) {
    console.error('Failed to submit testimonial:', error);
    if (photoUrl) await deleteFile(photoUrl);
    res.status(500).json({ message: 'Failed to submit testimonial', error: error.message });
  }
});

export default apiRoute;