import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex h-dvh min-h-[700px] w-full flex-col items-center justify-center overflow-hidden text-center">
      <div className="absolute inset-0 -z-10 bg-black/70" />
      <div
        className="absolute inset-0 -z-20 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://picsum.photos/1920/1080?random=hero)',
        }}
        data-ai-hint="background texture"
      />

      <div className="container px-4 text-white md:px-6">
        <h1 className="font-headline animate-fade-in-up bg-gradient-to-br from-white via-neutral-300 to-primary bg-clip-text text-4xl font-bold uppercase tracking-tight text-transparent transition-transform duration-300 hover:scale-105 sm:text-6xl md:text-7xl lg:text-8xl">
          Soy Javier
        </h1>
        <p className="mx-auto mt-6 max-w-3xl font-body text-lg text-gray-300 md:text-xl">
          ... Y hago diseño, desarrollo y tecnología para impulsar tu negocio.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href="#portfolio">Mis Proyectos</a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <a href="#contact">Hablemos</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
