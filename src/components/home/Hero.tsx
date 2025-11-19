'use client';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Paperclip, Link as LinkIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFirestore } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function Hero() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const { toast } = useToast();

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
  }, [text, isDeleting, loopNum]);

  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [url, setUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


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
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    if (value.length > 0 && !isExpanded) {
      setIsExpanded(true);
    } else if (value.length === 0 && isExpanded && !file && !showUrlInput) {
      setIsExpanded(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
            variant: "destructive",
            title: "Archivo demasiado grande",
            description: "Por favor, selecciona un archivo de menos de 5MB.",
        });
        return;
      }
      setFile(selectedFile);
      setShowUrlInput(false);
      setUrl('');
      if (!isExpanded) setIsExpanded(true);
    }
  };
  
  const handleAddUrlClick = () => {
    setShowUrlInput(true);
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    if (!isExpanded) setIsExpanded(true);
  }

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    if (message.length === 0 && !showUrlInput) {
        setIsExpanded(false);
    }
  }

  const removeUrlInput = () => {
    setShowUrlInput(false);
    setUrl('');
    if (message.length === 0 && !file) {
      setIsExpanded(false);
    }
  }

  const firestore = useFirestore();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message && !file && !url) {
        toast({
            variant: 'destructive',
            title: 'Formulario vacío',
            description: 'Por favor, completa alguno de los campos.',
        });
        return;
    }
    if (!name || !phone) {
        toast({
            variant: 'destructive',
            title: 'Faltan datos de contacto',
            description: 'Por favor, introduce tu nombre y teléfono.',
        });
        return;
    }
    
    setIsSubmitting(true);

    try {
      let attachmentUrl = '';
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `contact-attachments/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(uploadResult.ref);
      }

      const submissionsCollection = collection(firestore, 'contactFormSubmissions');
      await addDocumentNonBlocking(submissionsCollection, {
        name,
        phone,
        email: 'N/A', // Email is not collected in this form
        message,
        attachmentUrl,
        url,
        submissionDate: new Date().toISOString(),
        status: 'new',
      });
      
      toast({
        title: '¡Mensaje enviado!',
        description: 'Gracias por contactarme. Te responderé pronto.',
      });

      // Reset form
      setMessage('');
      setName('');
      setPhone('');
      setUrl('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowUrlInput(false);
      setIsExpanded(false);

    } catch (error) {
        console.error("Error submitting form:", error);
        toast({
            variant: 'destructive',
            title: 'Error al enviar',
            description: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-160px)] w-full items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="group flex flex-col items-center space-y-8">
            <div className="space-y-4">
              <h1
                style={{ animationDelay: '0.2s' }}
                className="animate-fade-in-up bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-headline text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap py-2"
              >
                Desarrollo <span className="whitespace-nowrap">{text}</span>
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
                <div className="group/input relative rounded-full border border-black/10 dark:border-white/10 bg-white p-2 pl-4 transition-all duration-300 hover:border-black/20 dark:hover:border-white/20">
                  <label htmlFor="hero-input" className="sr-only">
                    Escríbeme sobre tu...
                  </label>
                  <input
                    id="hero-input"
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    placeholder={`Escríbeme sobre tu ${placeholder}`}
                    className="w-full bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none text-base pr-24"
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                          disabled={isSubmitting}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto rounded-xl bg-white p-2 border border-black/10 text-neutral-900">
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            className="justify-start px-3 text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Paperclip className="mr-2 h-4 w-4" />
                            Adjuntar archivo
                          </Button>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                          <Button variant="ghost" onClick={handleAddUrlClick} className="justify-start px-3 text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900">
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
                        'h-8 w-8 rounded-full transition-colors',
                        (message || file || url)
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:brightness-110'
                          : 'bg-neutral-200 text-neutral-400'
                      )}
                      disabled={isSubmitting || (!message && !file && !url)}
                    >
                      {isSubmitting ? <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                 {file && (
                    <div className="mt-2 text-left w-full bg-white/80 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-full px-4 py-2 flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Paperclip className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={removeFile} disabled={isSubmitting}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                 {showUrlInput && (
                    <div className="mt-2 relative w-full">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <Input 
                            type="url" 
                            placeholder="Envíame tu web actual o referencia" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-white text-neutral-900 placeholder:text-neutral-500 dark:bg-black/30 dark:text-neutral-100 dark:placeholder:text-neutral-400 pl-9 pr-9"
                            disabled={isSubmitting}
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" onClick={removeUrlInput} disabled={isSubmitting}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
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
                      className="bg-white text-neutral-900 placeholder:text-neutral-500 dark:bg-black/30 dark:text-neutral-100 dark:placeholder:text-neutral-400"
                      disabled={isSubmitting}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Tu número de teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white text-neutral-900 placeholder:text-neutral-500 dark:bg-black/30 dark:text-neutral-100 dark:placeholder:text-neutral-400"
                      disabled={isSubmitting}
                      required
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
