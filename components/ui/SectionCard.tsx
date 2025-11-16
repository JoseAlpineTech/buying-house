"use client";

interface SectionCardProps {
  children: React.ReactNode;
}

export default function SectionCard({ children }: SectionCardProps) {
  return (
    <section className="relative rounded-xl border border-[--color-border] bg-[--color-card] p-4 md:p-8 mt-8 md:mt-12">
      {children}
    </section>
  );
}