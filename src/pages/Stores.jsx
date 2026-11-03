import React from 'react';
import { PageIntro } from '../components/PageIntro';

export default function Stores() {
  const stores = [
    {
      name: 'La Huerta Centro',
      area: 'Santiago',
      address: 'Calle Mercado 120',
      hours: 'Lunes a sábado de 09:00 a 20:00',
      sunday: 'Domingo de 09:00 a 14:00',
      services: 'Abarrotes, lácteos, frutas y verduras',
    },
    {
      name: 'La Huerta Barrio Norte',
      area: 'Independencia',
      address: 'Avenida Los Olivos 450',
      hours: 'Lunes a sábado de 08:30 a 20:30',
      sunday: 'Domingo de 09:00 a 15:00',
      services: 'Panadería, abarrotes y limpieza',
    },
  ];
  return (
    <>
      <PageIntro
        eyebrow="NUESTRAS TIENDAS"
        title="Tu próxima compra, más cerca."
        description="Conoce las sucursales de nuestra propuesta de supermercado."
      />
      <p className="mb-5 text-xs text-stone-500">
        Sucursales, direcciones y horarios ficticios para fines académicos.
      </p>
      <section className="grid gap-6 md:grid-cols-2">
        {stores.map((store, index) => (
          <article className="panel" key={store.name}>
            <div
              aria-hidden="true"
              className={`flex h-40 items-center justify-between p-7 ${index ? 'bg-amber-100 text-amber-900' : 'bg-sage text-forest'}`}
            >
              <span className="text-xs tracking-widest">LA HUERTA</span>
              <span className="text-6xl font-bold opacity-60">0{index + 1}</span>
              <span className="max-w-24 text-xs tracking-widest">SUPERMERCADO DE BARRIO</span>
            </div>
            <div className="p-7">
              <p className="eyebrow">{store.area}</p>
              <h2 className="text-xl font-semibold text-forest">{store.name}</h2>
              <address className="mt-2 text-sm not-italic text-stone-600">
                {store.address}, {store.area}
              </address>
              <h3 className="mt-6 text-sm font-semibold">Horarios de atención</h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {store.hours}
                <br />
                {store.sunday}
              </p>
              <h3 className="mt-6 text-sm font-semibold">Encuentra en tienda</h3>
              <p className="mt-2 text-sm text-stone-600">{store.services}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
