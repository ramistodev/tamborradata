import { Years } from './components/Years';

export function Header() {
  return (
    <header className="w-full max-w-7xl h-14 px-3 fixed z-20">
      <nav className="w-full h-full flex items-center justify-start px-4 border overflow-x-auto hide-scrollbar rounded backdrop-saturate-200 border-[#bebebe] dark:border-[#2c3e66] bg-[#f5f7fbcc] dark:bg-[#16294dcb]">
        <ul className="flex gap-6">
          <Years />
        </ul>
      </nav>
    </header>
  );
}
