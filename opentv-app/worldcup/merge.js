const fs = require('fs');
const path = require('path');

const m3uFiles = ['OnlyFifa.m3u', 'WorldCup.m3u', 'tvnetwork.m3u'];
const outputPath = path.join(__dirname, 'index.m3u');

let combinedContent = '#EXTM3U\n';

for (const file of m3uFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip the #EXTM3U header from individual files since we added one at the top
      if (line && !line.startsWith('#EXTM3U')) {
        combinedContent += line + '\n';
      }
    }
  }
}

fs.writeFileSync(outputPath, combinedContent);
console.log('Successfully merged all M3U files into index.m3u');
