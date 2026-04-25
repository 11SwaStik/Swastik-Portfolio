interface SectionHeaderProps {
  number: string;
  title: string;
  center?: boolean;
}

export default function SectionHeader({ number, title, center }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${center ? "text-center" : ""}`}>
      <span className="text-[0.58rem] text-green tracking-[5px] block mb-2">
        {`// ${number}`}
      </span>
      <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-white tracking-tight leading-none">
        {title}
        <span className="text-border-2">.</span>
      </h2>
      <div
        className={`w-8 h-0.5 bg-green mt-4 ${center ? "mx-auto" : ""}`}
      />
    </div>
  );
}
