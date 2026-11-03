import React from 'react';

export function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
      </div>
      {children}
    </section>
  );
}
