import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import logoImg from '../../../logo_navonmesa 1.png';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline", className)}>
      <Image src={logoImg} alt="Navonmeṣa" width={24} height={24} className="h-6 w-6" />
      <span>Navonmeṣa</span>
    </Link>
  );
}
