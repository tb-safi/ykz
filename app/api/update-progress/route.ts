import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'user_progress.json');
    
    // Read existing data if file exists
    let existingData = { words: [], lastUpdated: null };
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is invalid, we'll use the default data
      console.log('No existing progress file found, creating new one');
    }

    // Merge the new data with existing data
    const updatedData = {
      words: data.words || existingData.words,
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
} 