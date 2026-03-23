export default function PieDePagina() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full text-center text-sm text-gray-500 mt-10 pb-4">
      Desarrollado por ArPa®, todos los derechos reservados {year}
    </footer>
  );
}
