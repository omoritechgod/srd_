// pages/api/bookings/index.ts
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

// POST submit new booking (Public)
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Submit a new consultation booking
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - service
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               service:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Booking submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
apiRoute.post(handleFileUpload('file'), async (req: any, res: NextApiResponse) => {
  const { name, email, phone, service, date, notes } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !email || !phone || !service || !date) {
    if (fileUrl) await deleteFile(fileUrl);
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }

  try {
    const newBooking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date: new Date(date),
        notes,
        file: fileUrl,
        status: 'pending', // Default status
      },
    });
    res.status(201).json(newBooking);
  } catch (error: any) {
    console.error('Failed to submit booking:', error);
    if (fileUrl) await deleteFile(fileUrl);
    res.status(500).json({ message: 'Failed to submit booking', error: error.message });
  }
});

export default apiRoute;