'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Paperclip, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  }, [text, isDeleting, loopNum, words]);

  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const [placeholder, setPlaceholder] = useState('');
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
  const [loopNumPlaceholder, setLoopNumPlaceholder] = useState(0);
  const placeholderWords = ['próxima web', 'tienda online', 'idea de app'];

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

    const timer = setTimeout(
      handlePlaceholderTyping,
      typingSpeedPlaceholder
    );

    return () => clearTimeout(timer);
  }, [
    placeholder,
    isDeletingPlaceholder,
    loopNumPlaceholder,
    placeholderWords,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0 && !isExpanded) {
      setIsExpanded(true);
    } else if (value.length === 0 && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejaría el envío del formulario. Por ahora, redirige.
    router.push('/contact');
  };

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden">
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

            <form
              onSubmit={handleFormSubmit}
              style={{ animationDelay: '1s' }}
              className="animate-fade-in-up w-full max-w-xl flex flex-col items-center"
            >
              <div className="w-full transition-all duration-300">
                <div className="group/input relative rounded-full border border-black/10 bg-white p-2 pl-4 transition-all duration-300 hover:border-black/20">
                  <label htmlFor="hero-input" className="sr-only">
                    Escríbeme sobre tu...
                  </label>
                  <input
                    id="hero-input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`Escríbeme sobre tu ${placeholder}`}
                    className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-500 focus:outline-none text-base pr-24"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/5 text-black/50 hover:bg-black/10 hover:text-black/80"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto rounded-xl bg-white p-2 border border-black/10 text-neutral-900">
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" className="justify-start px-3 text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Adjuntar archivo
                          </Button>
                          <Button variant="ghost" className="justify-start px-3 text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Añadir URL
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8 rounded-full text-white transition-colors',
                        inputValue
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                          : 'bg-black/10'
                      )}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    'transition-all duration-500 ease-in-out overflow-hidden pb-1 px-1',
                    isExpanded
                      ? 'max-h-48 opacity-100 pt-2'
                      : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white text-neutral-900 placeholder:text-neutral-500"
                    />
                    <Input
                      type="tel"
                      placeholder="Tu número de teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white text-neutral-900 placeholder:text-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
