'use client';

import { useServerInsertedHTML } from 'next/navigation';

export default function HeadInjector({ headHtml }: { headHtml: string }) {
  useServerInsertedHTML(() => {
    return <head dangerouslySetInnerHTML={{ __html: headHtml }} />;
  });
  
  return null;
}
