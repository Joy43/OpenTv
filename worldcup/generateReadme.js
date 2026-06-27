const fs = require('fs');
const path = require('path');

const m3uPath = path.join(__dirname, 'tvnetwork.m3u');
const readmePath = path.join(__dirname, 'README.md');

if (!fs.existsSync(m3uPath)) {
  console.error("tvnetwork.m3u not found.");
  process.exit(1);
}

const content = fs.readFileSync(m3uPath, 'utf8');
const lines = content.split('\n');

let markdown = '# World Cup IPTV Channels\n\n';
markdown += 'Here is the list of all available TV networks from the playlist.\n\n';
markdown += '| Logo | Channel Name | Stream URL |\n';
markdown += '|------|--------------|------------|\n';

let currentLogo = '';
let currentName = '';
let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('#EXTINF')) {
    const logoMatch = line.match(/tvg-logo="(.*?)"/);
    currentLogo = logoMatch ? logoMatch[1] : '';
    
    // The name is everything after the last comma
    const lastCommaIndex = line.lastIndexOf(',');
    currentName = lastCommaIndex !== -1 ? line.substring(lastCommaIndex + 1).trim() : 'Unknown Channel';
  } else if (line.startsWith('http') || line.startsWith('https')) {
    const logoImg = currentLogo ? `<img src="${currentLogo}" width="30" />` : '';
    markdown += `| ${logoImg} | **${currentName}** | \`${line}\` |\n`;
    count++;
  }
}

fs.writeFileSync(readmePath, markdown);
console.log(`Successfully generated README.md with ${count} channels.`);
