import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

const tools = [
  {
    name: 'Photoshop',
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Adobe Photoshop</title>
        <path d="M12.152 2.024a.89.89 0 00-.786.01L.524 9.088a.888.888 0 00-.51 1.079.888.888 0 00.9.61h.001l.738-.201v9.648a.888.888 0 00.888.888h20.024a.888.888 0 00.888-.888v-9.648l.735.2a.888.888 0 00.9-.61.888.888 0 00-.509-1.08L12.937 2.033a.888.888 0 00-.785-.01zm-.24 2.82l7.307 4.966h-4.322a.888.888 0 01-.864-.672l-1.04-3.835a.888.888 0 01.46-.998.888.888 0 01.998.46l.01.02zm-1.782.332a.888.888 0 01.888.888v4.61h-5.26a.888.888 0 01-.76-.444l-2.09-3.62a.888.888 0 01.76-1.332h6.462zM3.864 12.63h5.95v7.48H3.863v-7.48zm7.048 0h8.2v7.48h-8.2v-7.48z" />
      </svg>
    ),
  },
  {
    name: 'Illustrator',
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Adobe Illustrator</title>
        <path d="M12.152 2.024a.89.89 0 00-.786.01L.524 9.088a.888.888 0 00-.51 1.079.888.888 0 00.9.61h.001l.738-.201v9.648a.888.888 0 00.888.888h20.024a.888.888 0 00.888-.888v-9.648l.735.2a.888.888 0 00.9-.61.888.888 0 00-.509-1.08L12.937 2.033a.888.888 0 00-.785-.01zm-.72 2.736l-3.328 8.048h2.09l.648-1.728h2.984l.648 1.728h2.09L13.22 4.76a.888.888 0 00-1.788 0zm-.084 1.79l1.04 2.78h-2.09l1.05-2.78zM3.864 12.63h5.95v7.48H3.863v-7.48zm7.048 0h8.2v7.48h-8.2v-7.48z" />
      </svg>
    ),
  },
  {
    name: 'Notion',
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Notion</title>
        <path d="M22.564 3.436A1.51 1.51 0 0021.055 1.93H6.84v18.068h2.41V4.937h2.296v15.06h2.41V4.937h2.295v15.06h2.41V3.436h.001zM4.14 1.93H2.943a1.51 1.51 0 00-1.51 1.507v18.061a1.51 1.51 0 001.51 1.504H4.14a1.51 1.51 0 001.51-1.504V3.436A1.51 1.51 0 004.14 1.93z" />
      </svg>
    ),
  },
  {
    name: 'Firebase',
    icon: (
       <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <title>Firebase</title>
        <path d="M4.242 19.497l2.829-16.97C7.15 1.83 7.674 1.5 8.23 1.5h7.538c.558 0 1.08.33 1.159.928l2.829 16.97c.08.483-.075.978-.44 1.33-.365.352-.86.55-1.37.55H5.975c-.51 0-1.006-.198-1.37-.55-.366-.352-.52-847-.439-1.33zM12 14.15l4.89-2.823-1.63-9.775L12 3.917l-3.26-2.365-1.63 9.775L12 14.15zm-2.82-1.63L12 17.41l2.82-4.89-2.82-1.628-2.82 1.628z" />
      </svg>
    ),
  },
];


export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center space-y-6">
              <header>
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                  Uniendo Creatividad y Código
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">
                  Soy Javier Velásquez, un tecnólogo creativo y diseñador de productos apasionado por construir experiencias digitales que sean intuitivas, impactantes y resuelvan problemas reales.
                </p>
              </header>
              <p className="leading-relaxed text-muted-foreground">
                Mi enfoque combina una profunda comprensión del diseño centrado en el usuario con la habilidad técnica para llevar esas ideas a la realidad. Disfruto cada etapa del proceso, desde la conceptualización y el prototipado hasta el desarrollo y lanzamiento final.
              </p>
               <p className="leading-relaxed text-muted-foreground">
                Fuera del trabajo, me encontrarás explorando nuevas tecnologías, contribuyendo a proyectos de código abierto o buscando inspiración en el arte y la naturaleza.
              </p>
            </div>
            <div className="relative">
               <Image
                  src="https://picsum.photos/seed/101/600/800"
                  alt="Javier Velásquez"
                  width={600}
                  height={800}
                  className="h-full w-full object-cover"
                  data-ai-hint="portrait person"
                />
            </div>
          </div>

          <section id="tools" className="w-full py-20 md:py-32">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mis Herramientas</h2>
              <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Estas son algunas de las herramientas que utilizo para dar vida a mis proyectos.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4">
              {tools.map((tool) => (
                <div key={tool.name} className="flex flex-col items-center justify-center text-center p-4 group">
                  <div className="w-16 h-16 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tool.name}</h3>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
