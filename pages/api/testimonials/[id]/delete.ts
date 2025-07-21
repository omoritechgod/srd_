```typescript
// pages/api/testimonials/[id]/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authMiddleware } from '../../../../middleware/authMiddleware';
import { deleteFile } from '../../../../utils/upload';
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

// DELETE testimonial by ID (Admin Protected)
/**
 * @swagger
 * /api/testimonials/{id}/delete:
 *   delete:
 *     summary: Delete a testimonial by ID
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
 *         description: ID of the testimonial to delete
 *     responses:
 *       204:
 *         description: Testimonial deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Internal server error
 */
apiRoute.delete(authMiddleware(async (req, res) => {
  const { id } = req.query;

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: String(id) },
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await prisma.testimonial.delete({
      where: { id: String(id) },
    });

    if (testimonial.photo) {
      await deleteFile(testimonial.photo);
    }

    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
}));

export default apiRoute;
```