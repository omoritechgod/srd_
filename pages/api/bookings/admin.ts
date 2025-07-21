```typescript
// pages/api/bookings/admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../middleware/authMiddleware';
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

// GET all bookings for admin (Admin Protected)
/**
 * @swagger
 * /api/bookings/admin:
 *   get:
 *     summary: Get all consultation bookings (admin only)
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
apiRoute.get(authMiddleware(async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings for admin:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}));

// PUT update booking status (Admin Protected)
/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update the status of a booking
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: New status for the booking
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid status provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
apiRoute.put(authMiddleware(async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: String(id) },
      data: { status },
    });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Failed to update booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
}));

export default apiRoute;
```