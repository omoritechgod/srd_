```typescript
// pages/api/testimonials/[id]/approve.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authMiddleware } from '../../../../middleware/authMiddleware';
import nextConnect from 'next-connect';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error('API Route Error:', error);
    res.status(501).json({ message: \`Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: \`Method '${req.method}\' Not Allowed` });
  },
});

// POST approve testimonial by ID (Admin Protected)
/**
 * @swagger
 * /api/testimonials/{id}/approve:
 *   post:
 *     summary: Approve a testimonial by ID
 *     tags:
 *       - Testimonials
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the testimonial to approve
 *     responses:
 *       200:
 *         description: Testimonial approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Testimonial'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Internal server error
 */
apiRoute.post(authMiddleware(async (req, res) => {
  const { id } = req.query;

  try {
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: String(id) },
      data: { approved: true },
    });
    res.status(200).json(updatedTestimonial);
  } catch (error) {
    console.error('Failed to approve testimonial:', error);
    res.status(500).json({ message: 'Failed to approve testimonial' });
  }
}));

export default apiRoute;
```