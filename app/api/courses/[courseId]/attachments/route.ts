import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSES_ID_ATTACHMENTS]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
