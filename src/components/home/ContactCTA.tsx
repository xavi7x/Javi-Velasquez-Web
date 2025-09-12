import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ContactCTA() {
  return (
    <section id="contact-cta" className="w-full py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
            Me encantaría escuchar sobre tu idea. Contáctame y construyamos algo increíble juntos.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Ponerse en contacto</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
