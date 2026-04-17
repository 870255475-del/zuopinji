import { NextResponse } from 'next/server';
import { getWorks, saveWorks, addWork, updateWork, deleteWork, Work, WorksData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getWorks();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading works:', error);
    return NextResponse.json({ error: 'Failed to read works' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const work: Work = await request.json();
    const success = await addWork(work);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to add work' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding work:', error);
    return NextResponse.json({ error: 'Failed to add work' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const success = await updateWork(id, updates);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update work' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating work:', error);
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    const success = await deleteWork(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 });
  }
}
