'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

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


  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
  const [loopNumPlaceholder, setLoopNumPlaceholder] = useState(0);
  const placeholderWords = ['próxima web', 'tienda online', 'tu idea de app'];

  useEffect(() => {
    let typingSpeedPlaceholder = isDeletingPlaceholder ? 80 : 150;
  
    const handlePlaceholderTyping = () => {
      const i = loopNumPlaceholder % placeholderWords.length;
      const fullText = placeholderWords[i];
  
      setPlaceholder(
        isDeletingPlaceholder
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );
  
      if (!isDeletingPlaceholder && placeholder === fullText) {
        // Pause at end of word
        setTimeout(() => setIsDeletingPlaceholder(true), 1500);

      } else if (isDeletingPlaceholder && placeholder === '') {
        setIsDeletingPlaceholder(false);
        setLoopNumPlaceholder((prev) => prev + 1);
      }
    };
  
    const timer = setTimeout(handlePlaceholderTyping, typingSpeedPlaceholder);
  
    return () => clearTimeout(timer);
  }, [placeholder, isDeletingPlaceholder, loopNumPlaceholder, placeholderWords]);


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/contact');
  };

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="group flex flex-col items-center space-y-8">
            <div className="space-y-4">
              <h1
                style={{ animationDelay: '0.2s' }}
                className="animate-fade-in-up bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-headline text-4xl font-bold leading-tight tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Desarrollo de <span className="whitespace-nowrap">{text}</span>
                <span className="animate-pulse">|</span>
              </h1>
              <p
                style={{ animationDelay: '0.6s' }}
                className="animate-fade-in-up font-headline text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl md:text-3xl"
              >
                Convierto tus ideas en experiencias digitales memorables.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} style={{ animationDelay: '1s' }} className="animate-fade-in-up w-full max-w-xl">
               <div className="group/input relative rounded-full border border-black/10 bg-white p-2 pl-4 transition-all duration-300 hover:border-black/20">
                  <label htmlFor="hero-input" className="sr-only">
                    Escríbeme sobre tu...
                  </label>
                  <input
                    id="hero-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Escríbeme sobre tu ${placeholder}`}
                    className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 focus:outline-none text-base"
                  />
                 <Button type="submit" variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/10 text-white group-hover/input:bg-black/20">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
