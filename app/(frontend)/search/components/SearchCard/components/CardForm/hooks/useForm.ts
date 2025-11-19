import { useSearchContext } from '@/app/(frontend)/search/context/useSearchContext';
import { fetchParticipants } from '@/app/(frontend)/search/logic/fetchParticipants';

export function useForm() {
  const { setParticipants, setAlert, alert } = useSearchContext();

  async function formSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;

    const cleanName = name
      .normalize('NFD') // Descompone caracteres con tildes
      .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos (tildes)
      .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por uno solo
      .trim();

    if (cleanName.split(' ').length < 3) {
      setAlert('Por favor, proporciona al menos un nombre y dos apellidos');
      return;
    }

    if (!company) {
      setAlert('Por favor, selecciona una compañia');
      return;
    }

    if (!name) {
      setAlert('Por favor, ingresa un nombre');
      return;
    }

    setAlert(null);
    const participants = await fetchParticipants(cleanName, company);

    if (participants === null) {
      setParticipants([]);
    }

    if (participants && participants.length > 0) {
      setParticipants(participants);
    }
  }

  return { formSubmit, alert };
}
