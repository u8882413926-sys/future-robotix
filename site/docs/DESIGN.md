# FUTURE: Design System (docs/DESIGN.md)

**Feel:** Dark, premium, minimal. Calm and cinematic. Large images, generous space, slow and smooth movement. Nothing flashy. Warm accent colour so it feels human, not cold.

**Rule of thumb:** If an element does not help a visitor understand a robot or take the next step, remove it.

---

## 1. Colour

All colours are CSS custom properties on `:root`. The site is dark only.

| Token | Hex | Use |
|---|---|---|
| `--bg-0` | `#07080A` | Page background |
| `--bg-1` | `#0D0F12` | Sections, footer |
| `--bg-2` | `#14171C` | Cards, inputs |
| `--bg-3` | `#1C2027` | Hovered cards, raised panels |
| `--line` | `#232830` | Hairline borders, dividers |
| `--line-strong` | `#323943` | Input borders, focus-adjacent borders |
| `--text-hi` | `#F2F4F7` | Headings, key text |
| `--text-mid` | `#A7AEB9` | Body text, descriptions |
| `--text-low` | `#7B8491` | Captions, helper text (use at 14px or larger) |
| `--accent` | `#FF8A3D` | Primary buttons, key highlights ("Ember") |
| `--accent-hover` | `#FFA45E` | Hover on accent |
| `--accent-press` | `#E06F25` | Pressed state |
| `--accent-soft` | `rgba(255,138,61,0.14)` | Tinted backgrounds, selected states |
| `--ion` | `#5EA1FF` | Links, focus ring, information |
| `--success` | `#3DD68C` | Success messages |
| `--warning` | `#F5C451` | Warnings, estimate notes |
| `--danger` | `#FF5C5C` | Errors |
| `--overlay` | `rgba(7,8,10,0.72)` | Dim layer behind modals and during page transitions |

**Contrast:** Body text (`--text-mid`) and headings on `--bg-0` pass WCAG AA (4.5:1 or better). Dark text (`#0A0B0D`) on `--accent` also passes. Do not place `--text-low` on `--bg-3`.

**Hero lighting:** Use one soft radial glow behind the robot image: `radial-gradient(60% 50% at 50% 40%, rgba(255,138,61,0.16), transparent 70%)`. No other gradients on large areas.

---

## 2. Typography (free, Google Fonts)

| Role | Font | Weights |
|---|---|---|
| Display and headings | **Sora** | 300, 500, 600 |
| Body and UI | **Inter** | 400, 500, 600 |
| Specs and numbers | **JetBrains Mono** | 400, 500 |

Load with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`, use `display=swap`, and subset to Latin. Fallbacks: `Sora, "Segoe UI", system-ui, sans-serif`; `Inter, system-ui, sans-serif`; `"JetBrains Mono", ui-monospace, monospace`.

### Type scale (fluid)

| Token | Size | Line height | Weight | Letter spacing | Use |
|---|---|---|---|---|---|
| `display` | `clamp(2.75rem, 1.5rem + 5vw, 6rem)` | 1.02 | 300 | -0.02em | Home hero headline |
| `h1` | `clamp(2.25rem, 1.4rem + 3.2vw, 4rem)` | 1.08 | 500 | -0.015em | Page headlines |
| `h2` | `clamp(1.75rem, 1.2rem + 2vw, 2.75rem)` | 1.15 | 500 | -0.01em | Section headings |
| `h3` | `clamp(1.25rem, 1.05rem + 0.8vw, 1.625rem)` | 1.25 | 500 | 0 | Card titles |
| `lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | 1.55 | 400 | 0 | Subheadlines |
| `body` | `1rem` | 1.65 | 400 | 0 | Paragraphs |
| `small` | `0.875rem` | 1.5 | 400 | 0.005em | Helper text, captions |
| `eyebrow` | `0.75rem` | 1.2 | 600 | 0.18em, uppercase | Small labels above headings |
| `spec` | `0.9375rem` | 1.4 | 400 | 0 | Specs (JetBrains Mono) |

Max line length for paragraphs: 65 characters (`max-width: 65ch`). Headlines use `text-wrap: balance`.

**Wordmark:** "FUTURE" in Sora 600, uppercase, letter spacing 0.24em, colour `--text-hi`. Use this until a real logo is supplied.

---

## 3. Spacing, layout and shape

**Spacing scale (4px base):** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192` px as tokens `--s-1` to `--s-11`.

- Section vertical padding: `clamp(96px, 12vw, 192px)` top and bottom.
- Container: max width `1280px`, side padding `clamp(20px, 4vw, 64px)`.
- Text-only container: max width `720px`.
- Grid: 12 columns, gap 24px (16px on mobile). Robot grid: 1 column on mobile, 2 on tablet, 3 on desktop.
- Breakpoints: 480, 768, 1024, 1440.

**Radius:** `--r-sm 6px` (inputs), `--r-md 12px` (cards), `--r-lg 20px` (large image frames), `--r-pill 999px` (buttons).
**Borders:** 1px `--line`. Prefer borders to shadows.
**Shadow (rare):** `0 24px 80px rgba(0,0,0,0.45)` for the expanded robot detail image only.

---

## 4. Components

### Buttons
Shared: height 52px (44px small), padding 0 28px, radius pill, Inter 600 at 15px, letter spacing 0.01em, minimum tap target 44px.

| Variant | Default | Hover | Pressed | Focus |
|---|---|---|---|---|
| **Primary** | bg `--accent`, text `#0A0B0D` | bg `--accent-hover`, arrow icon moves 4px right | bg `--accent-press`, scale 0.98 | 2px `--ion` ring, 3px offset |
| **Secondary** | transparent, 1px `--line-strong` border, text `--text-hi` | border `--text-mid`, bg `rgba(255,255,255,0.04)` | scale 0.98 | same ring |
| **Text link button** | text `--text-hi`, underline 1px hidden | underline grows from left (300ms) | opacity 0.8 | same ring |

Disabled: opacity 0.4, no hover, `cursor: not-allowed`. Loading: replace label with "Sending..." and a 16px spinner (static dots under reduced motion).

### Cards
**Robot card:** bg `--bg-2`, 1px `--line` border, radius 12px, overflow hidden. Image area 4:3 on a `--bg-1` backdrop. Below image, 24px padding: robot name (h3), tagline (body, `--text-mid`), and a text link "View robot" with an arrow.
**Info card (home "Who we build for"):** same surface, no image, an eyebrow label, h3, short text, text link button.
**Hover (desktop only):** card lifts 4px, border becomes `rgba(255,138,61,0.4)`, image scales to 1.04. Details in Motion Rules.

### Form fields
Height 52px, bg `--bg-2`, 1px `--line-strong` border, radius 6px, padding 0 16px, text `--text-hi`. Label above (small, `--text-mid`). Focus: border `--ion` plus 3px `rgba(94,161,255,0.25)` outer ring. Error: border `--danger`, message below in `--danger` with an icon (never colour alone). Textarea min height 140px. Checkbox and radio: 20px, accent when checked.

### Choice cards (company / institution, buy / build)
Selectable panels using radio semantics. Default: `--bg-2` with `--line` border. Selected: `--accent-soft` background and 1px `--accent` border, with a check icon top right.

### Operation rows
Checkbox, label (body, `--text-hi`), description (small, `--text-mid`), price on the right (JetBrains Mono, `--text-hi`). Selected rows get `--accent-soft` background.

### Price summary panel
Sticky on desktop (right column), fixed bottom sheet on mobile. bg `--bg-2`, 1px `--line`, radius 12px. Total in Sora 500 at 2rem. The note "This is an estimate. We confirm the final price after our team visits you." is always visible in `--warning` colour at 14px. Totals change with a quick 300ms fade-swap (no counting-up animation).

### Navigation
Fixed top, height 72px. Transparent at the top of the page. After 24px of scroll: bg `rgba(7,8,10,0.72)` with `backdrop-filter: blur(16px)` and a 1px `--line` bottom border. Hides on scroll down and returns on scroll up (320ms). Mobile: full-screen menu with large Sora links, links fade up with 60ms stagger.

### Footer
bg `--bg-1`, top border `--line`. Four columns on desktop, stacked on mobile.

---

## 5. Imagery

- Photography style: robot on a dark studio background, one soft rim light, three-quarter angle, lots of empty space. Transparent or very dark backgrounds so the page colour shows through.
- Card images: 1600x1200 WebP. Detail hero: 2400x1350 WebP. Gallery: 2000 px wide. Provide `srcset` and `sizes`. Lazy-load everything below the first screen. Always set width and height to avoid layout shift.
- Placeholders until real photos exist: a flat `--bg-1` block with a faint robot silhouette icon and the text "Image coming soon". Never use stock photos of other companies' robots.
- Optional hero video: muted, looped, under 6 MB, with a poster image. Do not autoplay under reduced motion.

---

## 6. MOTION RULES

**Principle:** Slow in, slow out. Movement should feel like a camera gliding, not a website bouncing. One main thing moves at a time. Animate only `transform` and `opacity` (plus `clip-path` where stated).

### 6.1 Duration tokens
| Token | Value | Use |
|---|---|---|
| `--d-instant` | 120ms | Colour changes, press feedback |
| `--d-fast` | 200ms | Hover colour, small toggles |
| `--d-base` | 360ms | Menus, fades, price swap |
| `--d-slow` | 600ms | Image zoom on hover, section transitions |
| `--d-reveal` | 800ms | Scroll reveals |
| `--d-cinematic` | 1100ms | Card-to-detail expansion, hero entrance |

### 6.2 Easing curves
| Token | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, entrances (fast start, long soft landing) |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | Page transitions, card-to-detail expansion |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover and small UI changes |
| `--ease-in` | `cubic-bezier(0.5, 0, 0.75, 0)` | Exits only |

No bouncy, springy or elastic easing anywhere.

### 6.3 Page transitions
- Use the View Transitions API (`document.startViewTransition`, or the framework's built-in support) for route changes.
- The nav and footer stay in place. Only the page content transitions.
- **Exit:** old content fades to 0 and moves up 8px over 280ms with `--ease-in`.
- **Enter:** new content fades from 0 and rises from 16px below to 0 over 560ms with `--ease-out`, starting 120ms after the exit ends.
- Scroll to top on new pages. Restore scroll position on browser Back.
- Fallback when the API is unsupported: instant route change with a 200ms opacity fade on the content area.
- Never block clicks for more than 400ms. Interrupting a transition by clicking again must work smoothly.

### 6.4 Card-to-detail expansion (robot grid to robot page)
Goal: the robot image grows smoothly from its card into the large image at the top of the detail page. No jump, no flash.

1. **Mechanism:** shared-element transition. Give the card image and the detail hero image the same `view-transition-name` (for example `robot-{slug}-image`), or use a layout-animation library with a shared layout id. Only one element on screen may use a given name at a time.
2. **On click:** capture the card image rectangle. Update the URL to `/robots/{slug}` straight away.
3. **Image:** animates from the card rectangle to the detail hero rectangle over `--d-cinematic` (1100ms) with `--ease-in-out`. Use scale and translate (FLIP). Do not animate width or height. Keep the aspect ratio correct by animating a clip-path on a larger fixed-aspect image so the picture never stretches.
4. **Other grid cards:** fade to 0 and scale to 0.96 over 360ms, starting at the same time, with a 40ms stagger by distance from the clicked card (maximum 200ms delay).
5. **Background:** the card's surface fades out. The page behind dims slightly with `--overlay` at 40% and returns to 0% when the transition ends.
6. **Detail text:** after 500ms, the heading, tagline, description, specs and operations rise 24px and fade in over 700ms with `--ease-out`, 80ms stagger between blocks (maximum 5 blocks, the rest appear together).
7. **Back:** the browser Back button and the "All robots" link reverse the transition over 800ms. The image returns exactly to its card, and the grid scroll position is restored.
8. **Direct visit or refresh** on `/robots/{slug}`: no expansion. Play the normal 560ms page enter with the image fading in.
9. **Accessibility:** after the transition ends, move focus to the detail page heading. Announce the page change through an `aria-live="polite"` region. All content is reachable by keyboard during and after.
10. **Interrupt:** if the user clicks Back mid-expansion, reverse from the current position rather than snapping.
11. **Fallbacks:** if shared-element transitions are unsupported or reduced motion is on, use a 250ms crossfade between pages.

### 6.5 Scroll reveals
- Use `IntersectionObserver` with `threshold: 0.2` and `rootMargin: "0px 0px -10% 0px"`.
- Reveal style: fade from 0 and rise 24px to 0 over `--d-reveal` (800ms) with `--ease-out`.
- Stagger siblings by 80ms, with a maximum of 5 staggered items.
- Each element reveals once and stays visible. No re-trigger on scroll up.
- Large images reveal with a soft clip-path wipe from the bottom (inset 8% to 0) over 1000ms, combined with a scale from 1.04 to 1.
- Headlines reveal line by line (60ms stagger) only on the Home hero. Elsewhere, use the standard reveal.
- Hero parallax: the hero image moves at most 8% of its height slower than the scroll. Disabled on mobile.
- Never hide content until JavaScript runs. Without JavaScript, everything is visible.

### 6.6 Hover and press effects (pointer devices only)
- **Buttons:** colour change in `--d-fast`. The arrow icon moves 4px right over `--d-base`. Press scales to 0.98 in `--d-instant`.
- **Robot cards:** lift 4px and border tint over 400ms with `--ease-standard`. The image scales 1.0 to 1.04 over `--d-slow` with `--ease-out`. The "View robot" arrow moves 4px right.
- **Text links:** underline grows from left to right over 300ms.
- **Nav links:** colour from `--text-mid` to `--text-hi` over `--d-fast`; a 1px accent line grows under the active link over 300ms.
- **Operation rows and choice cards:** background tint over `--d-fast`. Selection animates a check icon with a 200ms scale-in from 0.8.
- No cursor effects, no tilt, no glow that follows the mouse.
- On touch devices there are no hover effects; the pressed state gives feedback.

### 6.7 Other motion
- **Hero entrance (Home):** background glow fades in over 1100ms, the robot image rises 32px and fades in over 1100ms, headline lines follow 200ms later, buttons last. Total under 1.8 seconds.
- **Loading skeletons:** `--bg-2` blocks with a soft sheen moving left to right every 1.6s.
- **Form errors:** the message fades in over 200ms. No shaking.
- **Success state:** the check icon draws in over 600ms.

### 6.8 Reduced-motion fallback
When `@media (prefers-reduced-motion: reduce)` matches:
- Remove all translate, scale, parallax and clip-path wipes.
- Scroll reveals become simple opacity fades of 200ms. Stagger set to 0.
- Page transitions become a 150ms crossfade.
- Card-to-detail expansion becomes a 250ms crossfade (see 6.4 item 11).
- Hover lifts and image zooms are removed; only colour changes remain (200ms).
- No autoplaying video; show the poster. Skeleton sheen becomes a static tint.
- Provide the same behaviour if a visitor turns on a "Reduce motion" toggle placed in the footer (optional, storing the choice in memory for the session only).

### 6.9 Performance guardrails
- Target 60 fps on a mid-range Android phone.
- Use `will-change: transform, opacity` only on elements while they animate, then remove it.
- No more than one large animation at the same time.
- Images in transitions must already be loaded; preload the card image at full detail size when the user hovers or focuses a card.
- Largest Contentful Paint under 2.5 seconds on a 4G connection. Cumulative Layout Shift under 0.1.

---

## 7. Accessibility checklist
- Visible focus ring on every interactive element (2px `--ion`, 3px offset).
- Everything works with keyboard only. Tab order follows reading order.
- Minimum tap target 44x44px.
- Every image has useful `alt` text; decorative images use `alt=""`.
- Never rely on colour alone to show an error or a selection.
- Form fields have visible labels, not only placeholders.
- Page language `en-IN`.

---

## 8. CSS variables starter

```css
:root {
  --bg-0:#07080A; --bg-1:#0D0F12; --bg-2:#14171C; --bg-3:#1C2027;
  --line:#232830; --line-strong:#323943;
  --text-hi:#F2F4F7; --text-mid:#A7AEB9; --text-low:#7B8491;
  --accent:#FF8A3D; --accent-hover:#FFA45E; --accent-press:#E06F25;
  --accent-soft:rgba(255,138,61,0.14);
  --ion:#5EA1FF; --success:#3DD68C; --warning:#F5C451; --danger:#FF5C5C;
  --overlay:rgba(7,8,10,0.72);

  --font-display:"Sora","Segoe UI",system-ui,sans-serif;
  --font-body:"Inter",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,monospace;

  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px;
  --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px; --s-11:192px;

  --r-sm:6px; --r-md:12px; --r-lg:20px; --r-pill:999px;

  --d-instant:120ms; --d-fast:200ms; --d-base:360ms;
  --d-slow:600ms; --d-reveal:800ms; --d-cinematic:1100ms;
  --ease-out:cubic-bezier(0.16,1,0.3,1);
  --ease-in-out:cubic-bezier(0.76,0,0.24,1);
  --ease-standard:cubic-bezier(0.4,0,0.2,1);
  --ease-in:cubic-bezier(0.5,0,0.75,0);
}
html { color-scheme: dark; background: var(--bg-0); color: var(--text-mid); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 150ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 9. Items needing the founder
Logo file, real robot photography, and any brand colour preference. See `docs/QUESTIONS.md`.
