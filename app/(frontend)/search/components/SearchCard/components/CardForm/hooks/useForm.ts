import { useSearchContext } from '@/app/(frontend)/search/context/useSearchContext';
import { fetchParticipants } from '@/app/(frontend)/search/logic/fetchParticipants';
import { scrollToForm } from '../utils/scrollToForm';
import { useRef } from 'react';

export function useForm() {
  const { setParticipants, setIsLoading, setAlert, alert } = useSearchContext();
  const lastSearch = useRef<string[]>([]);

  async function formSubmit(e: React.FormEvent) {
    e.preventDefault();
    scrollToForm();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;

    const [lastName, lastCompany] = lastSearch.current;

    if (lastName === name && lastCompany === company) {
      return;
    }

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

    lastSearch.current = [name, company];

    setAlert(null);
    setIsLoading(true);
    const participants = await fetchParticipants(cleanName, company);

    if (participants === null) {
      setParticipants([]);
    }

    if (participants && participants.length > 0) {
      setParticipants(participants);
    }

    setIsLoading(false);
  }

  return { formSubmit, alert };
}
