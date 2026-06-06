export function AuthBackground() {
  return (
    <>
      <div className="absolute top-[10%] left-[10%] w-2/5 h-2/5 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-tertiary-container/10 rounded-full blur-[100px] pointer-events-none" />
    </>
  );
}
