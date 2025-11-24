import fs from 'fs';
import path from 'path';

export default function EmbedPage() {
  const htmlPath = path.join(process.cwd(), 'public', 'survival-race.embed.html');
  const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
