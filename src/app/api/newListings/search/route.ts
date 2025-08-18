import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { NewListing } from '@/lib/models/NewListing';
import { isAuthenticated } from '@/lib/auth';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const departments = searchParams.get('departments');
    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 10);

    const order = (sortBy === "updatedAt" || sortBy === "createdAt") ? sortOrder === "1" ? -1: 1 : sortOrder === "1" ? 1: -1;

    const pipeline: mongoose.PipelineStage[] = [];

    if (query) {
        pipeline.push({
            $search: {
                index: 'default',
                text: {
                    query: query as string,
                    path: {
                        wildcard: '*'
                    },
                },
            },
        });

        pipeline.push({
            $set: {
                searchScore: { $meta: 'searchScore' },
            },
        });
    }

    if (departments) {
      const departmentList = (departments as string).split(',');
      ``
      pipeline.push({
          $match: {
              departments: { $in: departmentList },
          },
      });
    }

    // Filter out archived and unconfirmed listings
    pipeline.push({
          $match: {
              archived: false,
              confirmed: true
          },
    })

    pipeline.push({
        $sort: sortBy ? { [sortBy as string]: order, _id: 1 } : { searchScore: -1, updatedAt: -1, _id: 1 },
    });

    pipeline.push(
        { $skip: (Number(page) - 1) * Number(pageSize) },
        { $limit: Number(pageSize) }
    );

    const results = await NewListing.aggregate(pipeline);

    return NextResponse.json({ results, page, pageSize });
  } catch (error) {
    console.error('Error executing search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}