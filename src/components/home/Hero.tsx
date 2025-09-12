export function Hero() {
  const name = 'Javier Velásquez';

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center group">
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
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            </h1>
            <p
              style={{ animationDelay: '0.6s' }}
              className="animate-fade-in-up mt-4 bg-gradient-to-br from-foreground to-primary bg-clip-text font-headline text-xl font-medium tracking-tight text-transparent sm:text-2xl md:text-3xl"
            >
              Tecnólogo Creativo & Diseñador de Productos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}