const fs = require('fs');
const path = require('path');

const slideMdPath = path.join(__dirname, '..', 'Slide.md');
const outputPath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'slidesData.ts');

if (!fs.existsSync(slideMdPath)) {
  console.error(`Slide.md not found at ${slideMdPath}`);
  process.exit(1);
}

const content = fs.readFileSync(slideMdPath, 'utf-8');
const lines = content.split(/\r?\n/);

const slides = [];
let currentIndex = null;
let currentTitle = '';
let inSvg = false;
let svgLines = [];

const slideHeaderRegex = /(?:Slide|\[Slide)\s*(\d+)/i;

lines.forEach((line) => {
  const match = line.match(slideHeaderRegex);
  if (match) {
    // If we find a new slide header, clean up previous state if we had a partial SVG
    inSvg = false;
    svgLines = [];
    
    currentIndex = parseInt(match[1], 10);
    
    // Clean up title
    let rawTitle = line.replace(match[0], '').trim();
    // Clean up prefix symbols like ':', '-', ']'
    rawTitle = rawTitle.replace(/^[\]:\-\s]+/, '').replace(/[\]]+$/, '').trim();
    currentTitle = rawTitle || `Slide ${match[1]}`;
    return;
  }

  if (line.includes('<svg')) {
    inSvg = true;
    svgLines = [];
  }

  if (inSvg) {
    svgLines.push(line);
  }

  if (line.includes('</svg>')) {
    inSvg = false;
    if (currentIndex !== null) {
      slides.push({
        index: currentIndex,
        title: currentTitle,
        svgCode: svgLines.join('\n')
      });
    }
    currentIndex = null;
    currentTitle = '';
    svgLines = [];
  }
});

// Generate TS file
const tsCode = `// Generated automatically by scripts/parse-slides.js. Do not edit manually.

export interface ParsedSlide {
  index: number;
  title: string;
  svgCode: string;
}

export const PARSED_SLIDES: ParsedSlide[] = ${JSON.stringify(slides, null, 2)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, tsCode, 'utf-8');
console.log(`Successfully parsed ${slides.length} slides and saved to ${outputPath}`);
