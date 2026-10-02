import { scrollToForm } from '../utils/scrollToForm';

export function NameInput({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="flex flex-col w-full gap-2">
      <label htmlFor="name" className="font-semibold">
        Nombre y apellidos:
      </label>
      <input
        type="text"
        id="name"
        autoComplete="off"
        aria-required="true"
        autoCapitalize="words"
        defaultValue={defaultValue}
        onFocus={() => scrollToForm()}
        name="name"
        required
        className="w-full px-3 py-2 bg-(--color-bg-secondary) rounded-md outline-none"
        placeholder="Ingresa nombre y apellidos..."
      />
    </div>
  );
}
