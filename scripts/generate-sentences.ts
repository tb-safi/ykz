import fs from 'fs/promises';
import path from 'path';
import { Word } from '../lib/types';
import { generateSentenceWithClaude } from '../lib/claude';

const WORDS_FILE = path.join(process.cwd(), 'public', 'finnish_words_2000.json');
const PROGRESS_FILE = path.join(process.cwd(), 'public', 'user_progress.json');
const BATCH_SIZE = 10; // Process 10 words at a time
const SAVE_INTERVAL = 50; // Save progress every 50 words

async function loadWords(): Promise<Word[]> {
  try {
    const data = await fs.readFile(WORDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading words:', error);
    return [];
  }
}

async function saveWords(words: Word[]): Promise<void> {
  try {
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(words, null, 2));
  } catch (error) {
    console.error('Error saving words:', error);
  }
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

async function generateAllSentences() {
  try {
    console.log('Starting sentence generation for all words...');
    const words = await loadWords();
    const wordsNeedingSentences = words.filter(word => !word.sentence);
    const totalWords = wordsNeedingSentences.length;
    
    if (totalWords === 0) {
      console.log('All words already have sentences!');
      return;
    }

    console.log(`Found ${totalWords} words needing sentences`);
    const startTime = Date.now();
    let processedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    // Process words in batches
    for (let i = 0; i < wordsNeedingSentences.length; i += BATCH_SIZE) {
      const batch = wordsNeedingSentences.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (word) => {
        try {
          const sentence = await generateSentenceWithClaude(word.finnish, word.english);
          word.sentence = sentence;
          successCount++;
        } catch (error) {
          console.error(`Failed to generate sentence for ${word.finnish}:`, error);
          failureCount++;
        }
        processedCount++;
        
        // Calculate progress
        const elapsedTime = Date.now() - startTime;
        const wordsPerSecond = processedCount / (elapsedTime / 1000);
        const remainingWords = totalWords - processedCount;
        const estimatedTimeRemaining = remainingWords / wordsPerSecond;
        
        // Update progress bar
        const progress = (processedCount / totalWords) * 100;
        const progressBar = '='.repeat(Math.floor(progress / 2)) + '>'.padEnd(50 - Math.floor(progress / 2), ' ');
        
        console.clear();
        console.log(`Progress: [${progressBar}] ${progress.toFixed(1)}%`);
        console.log(`Processed: ${processedCount}/${totalWords} words`);
        console.log(`Success: ${successCount}, Failed: ${failureCount}`);
        console.log(`Speed: ${wordsPerSecond.toFixed(2)} words/second`);
        console.log(`Time elapsed: ${formatTime(elapsedTime)}`);
        console.log(`Estimated time remaining: ${formatTime(estimatedTimeRemaining)}`);
      });

      await Promise.all(batchPromises);
      
      // Save progress periodically
      if (i % SAVE_INTERVAL === 0) {
        await saveWords(words);
        console.log('\nProgress saved!');
      }
      
      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Final save
    await saveWords(words);
    
    const totalTime = Date.now() - startTime;
    console.log('\nFinished generating sentences!');
    console.log(`Total time: ${formatTime(totalTime)}`);
    console.log(`Success rate: ${((successCount / totalWords) * 100).toFixed(1)}%`);
    console.log(`Failed words: ${failureCount}`);
  } catch (error) {
    console.error('Error in generateAllSentences:', error);
  }
}

// Run the script
generateAllSentences(); 