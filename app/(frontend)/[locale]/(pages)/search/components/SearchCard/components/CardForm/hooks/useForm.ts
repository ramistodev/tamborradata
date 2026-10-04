import { scrollToForm } from '../utils/scrollToForm';

import { useState } from 'react';

export function useForm({
  onSubmit,
}: {
  onSubmit?: (params: { name: string; company: string }) => void;
}) {
  const [alert, setAlert] = useState<string | null>(null);

  async function formSubmit(e: React.FormEvent) {
    e.preventDefault();
    scrollToForm();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;

    if (!name) {
      setAlert('Por favor, ingresa un nombre');
      return;
    }

    if (!company) {
      setAlert('Por favor, selecciona una compañia');
      return;
    }

    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanName.split(' ').length < 3) {
      setAlert('Por favor, proporciona al menos un nombre y dos apellidos');
      return;
    }

    setAlert(null);
    onSubmit?.({ name: cleanName, company });
  }

  return { formSubmit, alert };
}
