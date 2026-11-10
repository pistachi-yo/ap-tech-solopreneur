// Figma: "Hero" (6005:3626)

export function Hero() {
  return (
    <section className="flex flex-col gap-6 bg-chestnut-primary px-3 py-6 md:px-8 md:py-12">
      <div className="flex flex-col gap-6 rounded-lg bg-chestnut-tertiary p-6 md:p-12">
        <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900 md:text-6xl md:leading-[1.1]">
          Learn to sew from simple projects
        </h1>

        <p className="text-body text-chestnut-900">
          At Unpicked, you’ll find super simple projects to kick off your sewing
          skills.
        </p>

        <p className="text-body text-chestnut-900">
          When we say step-by-step, <em>we mean it.</em>
        </p>

        <div className="flex flex-wrap gap-4">
          {/* Figma: "Button - Nova" (primary) */}
          <a
            href="#projects"
            className="flex items-center justify-center rounded-lg bg-chestnut-primary px-2.5 py-2 text-body-sm font-medium whitespace-nowrap text-white hover:bg-chestnut-primary/90"
          >
            Let’s start sewing
          </a>

          {/* Figma: "Button - Nova" (outline) */}
          <a
            href="#mission"
            className="flex items-center justify-center rounded-lg border border-chestnut-primary px-2.5 py-2 text-body-sm font-medium whitespace-nowrap text-chestnut-900 hover:bg-chestnut-primary/10"
          >
            Learn about our Mission
          </a>
        </div>
      </div>

      <img
        src="/landing/hero.png"
        alt="Hands sewing a pink patterned fabric"
        width={4096}
        height={3072}
        className="aspect-[4096/3072] w-full rounded-lg object-cover"
      />
    </section>
  )
}
