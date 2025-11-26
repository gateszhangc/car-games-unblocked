import HeadInjector from '@/components/HeadInjector';
import CommentSection from '@/components/CommentSection';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Car Games Unblocked',
  description: 'Play car games online',
};

// 在模块加载时读取文件（构建时执行）
const headHtml = fs.readFileSync(path.join(process.cwd(), 'public/data/home-head.html'), 'utf8');
const bodyHtml = fs.readFileSync(path.join(process.cwd(), 'public/data/home-body.html'), 'utf8');

export default function HomePage() {
  return (
    <>
      <HeadInjector headHtml={headHtml} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <CommentSection />
    </>
  );
}
