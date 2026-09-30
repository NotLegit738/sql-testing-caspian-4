import { NextRequest, NextResponse } from 'next/server';
import pool, { initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO staff_applications (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    connection.release();

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initializeDatabase();
    
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM staff_applications ORDER BY created_at DESC'
    );
    connection.release();

    return NextResponse.json({ applications: rows });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
