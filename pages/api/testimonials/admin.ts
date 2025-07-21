```typescript
// pages/api/testimonials/admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../middleware/authMiddleware';
import nextConnect from 'next-connect';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ message: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` });
  },
});

// GET all testimonials for admin (Admin Protected)
/**
 * @swagger
 * /api/testimonials/admin:
 *   get:
 *     summary: Get all testimonials (admin only)
 *     tags:
 *       - Testimonials
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all testimonials, including pending ones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
apiRoute.get(authMiddleware(async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials for admin:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
}));

export default apiRoute;
```