import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { productTypes } from '../data/articles';
import { PageIntro } from '../components/PageIntro';

const emptyForm = { name: '', brand: '', type: '', price: '', stock: '' };
export default function NewArticle() {
  const { addArticle } = useInventory();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const formRef = useRef(null);
  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }
  function submit(event) {
    event.preventDefault();
    const result = addArticle(form);
    setErrors(result.errors);
    const invalid = Object.keys(result.errors);
    if (invalid.length) {
      formRef.current.elements.namedItem(invalid[0])?.focus();
      return;
    }
    navigate('/inventario');
  }
  function field(name) {
    return {
      id: name,
      name,
      value: form[name],
      onChange: update,
      required: true,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    };
  }
  const error = (name) =>
    errors[name] && (
      <span id={`${name}-error`} className="mt-1 block text-xs text-red-700">
        {errors[name]}
      </span>
    );
  return (
    <>
      <PageIntro
        eyebrow="REGISTRO DE ARTÍCULOS"
        title="Un nuevo producto en el catálogo."
        description="Completa los datos del artículo. Al guardar, podrás verlo en el listado de inventario."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-forest">Datos del artículo</h2>
          <p className="mt-2 text-xs text-stone-500">Todos los campos son obligatorios.</p>
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="mt-7 grid gap-6 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label htmlFor="name">Nombre del artículo</label>
              <input
                {...field('name')}
                maxLength={80}
                placeholder="Ej. Café molido 250 g"
                autoComplete="off"
              />
              {error('name')}
            </div>
            <div>
              <label htmlFor="brand">Marca</label>
              <input
                {...field('brand')}
                maxLength={60}
                placeholder="Ej. Nescafé"
                autoComplete="off"
              />
              {error('brand')}
            </div>
            <div>
              <label htmlFor="type">Categoría</label>
              <select {...field('type')}>
                <option value="">Selecciona una categoría</option>
                {productTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              {error('type')}
            </div>
            <div>
              <label htmlFor="price">Precio unitario (CLP)</label>
              <input
                {...field('price')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                min="1"
                max="100000000"
                step="1"
                placeholder="Ej. 3990"
              />
              {error('price')}
            </div>
            <div>
              <label htmlFor="stock">Existencias iniciales</label>
              <input
                {...field('stock')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                min="0"
                max="1000000"
                step="1"
                placeholder="Ej. 12"
              />
              {error('stock')}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-6 sm:col-span-2">
              <button type="submit" className="button-primary">
                Guardar artículo
              </button>
              <Link to="/inventario" className="button-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </section>
        <aside className="rounded-2xl border border-emerald-100 bg-sage p-7">
          <span aria-hidden="true" className="text-4xl">
            🌿
          </span>
          <h2 className="mt-5 text-lg font-semibold text-forest">
            Un catálogo fácil de consultar.
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Utiliza un nombre que identifique el producto e incluya su formato o contenido. La marca
            y el tipo te ayudarán a encontrarlo después.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Puedes registrar artículos sin existencias. Aparecerán como agotados hasta que
            actualices su cantidad.
          </p>
        </aside>
      </div>
    </>
  );
}
