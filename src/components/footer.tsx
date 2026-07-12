export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-center md:flex-row md:px-10 md:text-left">
        <div>
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            RobsonLuiz<span className="text-[#7CFF3B]">.DEV</span>
          </p>
          <p className="text-xs text-muted-foreground">Desenvolvedor Full Stack</p>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 RobsonLuiz.DEV. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
