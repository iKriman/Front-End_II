import React from 'react';
import { Link } from 'react-router-dom';
import { PageIntro } from '../components/PageIntro';

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="QUIÉNES SOMOS"
        title="Cerca de tu barrio. Cerca de tu mesa."
        description="Un supermercado pensado para las compras de cada día."
      />
      <section className="panel max-w-4xl p-6 sm:p-8">
        <p className="eyebrow">NUESTRA HISTORIA</p>
        <h2 className="text-2xl font-semibold tracking-tight text-forest">
          Lo cotidiano merece hacerse bien.
        </h2>
        <p className="mt-5 text-sm leading-8 text-stone-600">
          La Huerta es una propuesta de supermercado de barrio que reúne alimentos y productos para
          el hogar en un mismo lugar. Queremos que cada visita sea simple, con precios claros y
          productos fáciles de encontrar.
        </p>
        <p className="mt-3 text-sm leading-8 text-stone-600">
          Una buena atención empieza con organización. Nuestro inventario permite conocer las
          existencias y detectar qué productos necesitan reposición.
        </p>
        <p className="mt-4 text-xs text-stone-500">
          La Huerta es una marca ficticia creada para este proyecto académico.
        </p>
      </section>
      <section className="my-8 grid gap-6 md:grid-cols-3">
        {[
          [
            '01 / PROPÓSITO',
            'Nuestra misión',
            'Facilitar las compras diarias con un surtido útil, un trato respetuoso y una gestión responsable de los productos.',
          ],
          [
            '02 / FUTURO',
            'Nuestra visión',
            'Ser un punto de encuentro de confianza para el barrio, donde comprar sea una experiencia cercana y ordenada.',
          ],
          [
            '03 / COMPROMISO',
            'Nuestros valores',
            'Honestidad en la información, respeto por las personas y cuidado de los recursos para reducir desperdicios.',
          ],
        ].map(([label, title, text]) => (
          <article key={title} className="border-t border-stone-300 pt-6">
            <p className="eyebrow">{label}</p>
            <h2 className="text-lg font-semibold text-forest">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
          </article>
        ))}
      </section>
      <Link
        className="text-sm font-semibold text-forest underline underline-offset-4"
        to="/nuestras-tiendas"
      >
        Conoce nuestras tiendas →
      </Link>
    </>
  );
}
