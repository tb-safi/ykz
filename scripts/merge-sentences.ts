import fs from 'fs/promises';
import path from 'path';
import { Word } from '../lib/types';

const WORDS_FILE = path.join(process.cwd(), 'public', 'finnish_words_2000.json');
const PROGRESS_FILE = path.join(process.cwd(), 'public', 'user_progress.json');

async function mergeSentences() {
  try {
    // Read both files
    const [wordsData, progressData] = await Promise.all([
      fs.readFile(WORDS_FILE, 'utf-8'),
      fs.readFile(PROGRESS_FILE, 'utf-8')
    ]);

    const words: Word[] = JSON.parse(wordsData);
    const progressWords: Word[] = JSON.parse(progressData);

    // Create a map of sentences from progress words
    const sentenceMap = new Map(
      progressWords
        .filter(word => word.sentence)
        .map(word => [word.rank, word.sentence])
    );

    // Merge sentences into main words
    const mergedWords = words.map(word => ({
      ...word,
      sentence: sentenceMap.get(word.rank) || word.sentence
    }));

    // Save back to the words file
    await fs.writeFile(WORDS_FILE, JSON.stringify(mergedWords, null, 2));
    console.log('Successfully merged sentences into words file');
  } catch (error) {
    console.error('Error merging sentences:', error);
  }
}

mergeSentences(); 