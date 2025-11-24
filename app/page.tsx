import { loadHtmlFragment } from '@/lib/loadHtmlFragment';
import HeadInjector from '@/components/HeadInjector';

export default function HomePage() {
  const headHtml = loadHtmlFragment('home-head.html');
  const bodyHtml = loadHtmlFragment('home-body.html');
  
  return (
    <>
      <HeadInjector headHtml={headHtml} />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
