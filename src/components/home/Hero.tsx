'use client';
import { useState, useEffect } from 'react';

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
  }, [text, isDeleting, loopNum, typingSpeed, words]);


  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-950"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl text-left">
          <div className="group flex flex-col items-start">
            <h1
              style={{ animationDelay: '0.2s' }}
              className="animate-fade-in-up bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-headline text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Desarrollo
              <br />
              {text}
              <span className="animate-pulse">|</span>
            </h1>
            <p
              style={{ animationDelay: '0.6s' }}
              className="animate-fade-in-up mt-4 font-headline text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl md:text-3xl"
            >
              Transformo tus ideas en experiencias digitales memorables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
