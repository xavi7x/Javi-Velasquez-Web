'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ['Páginas Web', 'Tiendas Online', 'Aplicaciones Web'];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, loopNum]);

  const [text2, setText2] = useState('');
  const [isDeleting2, setIsDeleting2] = useState(false);
  const [loopNum2, setLoopNum2] = useState(0);

  const words2 = ['próxima web', 'tienda online', 'tu idea de app'];

  useEffect(() => {
    const handleTyping2 = () => {
      const i = loopNum2 % words2.length;
      const fullText = words2[i];

      setText2(
        isDeleting2
          ? fullText.substring(0, text2.length - 1)
          : fullText.substring(0, text2.length + 1)
      );

      const typingSpeed2 = isDeleting2 ? 80 : 150;

      if (!isDeleting2 && text2 === fullText) {
        setTimeout(() => setIsDeleting2(true), 1500);
      } else if (isDeleting2 && text2 === '') {
        setIsDeleting2(false);
        setLoopNum2(loopNum2 + 1);
      }
      
      const timer = setTimeout(handleTyping2, typingSpeed2);
      return () => clearTimeout(timer);
    };

    const timer = setTimeout(handleTyping2, 150); // Initial delay
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text2, isDeleting2, loopNum2]);

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl text-left">
          <div className="group flex flex-col items-start space-y-8">
            <div className="space-y-4">
              <h1
                style={{ animationDelay: '0.2s' }}
                className="animate-fade-in-up bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-headline text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Desarrollo
                {' '}
                {text}
                <span className="animate-pulse">|</span>
              </h1>
              <p
                style={{ animationDelay: '0.6s' }}
                className="animate-fade-in-up font-headline text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl md:text-3xl"
              >
                Convierto tus ideas en experiencias digitales memorables.
              </p>
            </div>

            <Link href="/contact" style={{ animationDelay: '1s' }} className="animate-fade-in-up w-full max-w-2xl">
              <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                <p className="text-muted-foreground text-lg">
                  Escríbeme sobre tu{' '}
                  <span className="text-foreground">
                    {text2}
                    <span className="animate-pulse">|</span>
                  </span>
                </p>
                 <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/10 text-foreground group-hover:bg-white/20">
                  <ArrowRight />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
