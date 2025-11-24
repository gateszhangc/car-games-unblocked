import fs from 'fs';
import path from 'path';

export function loadHtmlFragment(filename: string): string {
  const filePath = path.join(process.cwd(), ''public/data'', filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '';
}
