'use client';
import { useState, useEffect } from 'react';

export function Hero() {
  const name = 'Javier Velásquez';
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ['Gráfico', 'Web', 'Digital'];

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
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="group flex flex-col items-center">
            <h1
              style={{ animationDelay: '0.2s' }}
              className="animate-fade-in-up font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <div className="flex">
                {name.split('').map((char, index) => (
                  <span
                    key={index}
                    className="transition-all duration-300 group-hover:-translate-y-1.5"
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </div>
            </h1>
            <p
              style={{ animationDelay: '0.6s' }}
              className="animate-fade-in-up mt-4 bg-gradient-to-br from-foreground to-primary bg-clip-text font-headline text-xl font-medium tracking-tight text-transparent sm:text-2xl md:text-3xl"
            >
              Hago Diseño {text}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
