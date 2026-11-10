// Figma: "Hero" — 412px (6005:3626) and 1280px (6017:375)
//
// Responsive steps (mobile first):
//   < 640px   412 design: stacked, 12px side padding around the card
//   640px+    stacked, 24px padding (the 1280 design's hero padding)
//   768px+    stacked, photo cropped to 16:9 so it doesn't get very tall
//   1024px+   1280 design: two equal columns (text card | photo), card stretches
//             to the photo's height and centres its content vertically
//   > 1280px  content stays 1280px wide and centred; the chestnut band is full-bleed

export function Hero() {
  return (
    <section className="bg-chestnut-primary">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-3 py-6 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-chestnut-tertiary p-6">
          <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
            Learn to sew from simple projects
          </h1>

          <p className="text-body text-chestnut-900">
            At Unpicked, you’ll find super simple projects to kick off your
            sewing skills.
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
          className="aspect-[4096/3072] w-full rounded-lg object-cover md:aspect-video lg:aspect-[4096/3072]"
        />
      </div>
    </section>
  )
}
