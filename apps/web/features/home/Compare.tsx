import { Reveal } from "@/features/motion/Reveal";
import { SectionHead } from "./SectionHead";

const rows: [string, string, string, string][] = [
  ["A person checks every photo", "Always", "Paid extra", "Your own time"],
  ["Fire, TV fill, object removal", "Included", "Limited", "Hours in Photoshop"],
  ["Floor plans and video in one order", "Yes", "No", "No"],
  ["Someone to message at 2 AM", "WhatsApp", "Help centre", "You"],
  ["Price per photo", "From $0.50", "$0.22–0.50", "Your hourly rate"],
];

/** Why a team: TechX against AI apps and editing in-house; price row last. */
export function Compare() {
  return (
    <section className="wrap pt-28 md:pt-40">
      <SectionHead label="Why a team" lead="AI is fast." rest="Your listings still need someone to check it." />
      <Reveal className="overflow-x-auto rounded-card bg-surface shadow-hair">
        <table className="w-full min-w-[640px] text-left text-[15px]">
          <thead>
            <tr className="font-mono text-label uppercase text-ink-2">
              <th className="w-[34%] px-6 py-5 font-medium"><span className="sr-only">Feature</span></th>
              <th className="bg-blue-tint/60 px-6 py-5 font-medium text-ink">TechX</th>
              <th className="px-6 py-5 font-medium">AI editing apps</th>
              <th className="px-6 py-5 font-medium">Editing in-house</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([f, t, a, h], i) => (
              <tr key={f} className="group border-t border-line transition-colors duration-200 hover:bg-page">
                <th scope="row" className="px-6 py-[18px] font-medium">{f}</th>
                <td className="bg-blue-tint/60 px-6 py-[18px]">
                  {i < rows.length - 1 ? <span className="flex items-center gap-2 text-blue-2"><span className="size-2 rounded-full bg-blue transition-transform duration-200 group-hover:scale-125" />{t}</span> : <span className="font-medium">{t}</span>}
                </td>
                <td className="px-6 py-[18px] text-ink-2">{a}</td>
                <td className="px-6 py-[18px] text-ink-2">{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
