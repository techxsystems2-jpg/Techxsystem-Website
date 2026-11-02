# Photo credits

Sample photos in `apps/web/public/photos/`, used in the hero before/after until TechX supplies real raw/edited pairs.
All CC0 (public domain dedication): no attribution required. Converted to 1920 × 1080 WebP.

| File | Source | Licence |
|---|---|---|
| ext.webp | https://commons.wikimedia.org/wiki/File:White_Wooden_Building_(Pexels_53610).jpg | CC0 |
| int.webp | https://commons.wikimedia.org/wiki/File:Budapest_Apartment_(Unsplash).jpg | CC0 |
| twi.webp | https://commons.wikimedia.org/wiki/File:Cozy_white_house_(Unsplash).jpg | CC0 |
| aer.webp | https://commons.wikimedia.org/wiki/File:Bukit_Timah,_Singapore_(Unsplash).jpg | CC0 |

The "before" side is the same photo with a CSS raw-bracket filter (set in `features/before-after/BeforeAfter.tsx`). Replace with
TechX's real pairs by passing `before` to `BeforeAfter`.

## Icons

Key-pointer icons in the hero are from the Pikaicons free pack (https://pikaicons.com, `/icons/free/stroke.svg`):
clock-default, shield-check, refresh, wallet-default. Free icons are licensed for personal and commercial use;
attribution is optional. Paid Pikaicons must not be added to this repo (licence: not in public code repositories).

## TechX portfolio (owner, 2026-10-31)
From the old site's portfolio (techxsystems.com/img/portfolio/…), TechX's own finished edits, used in the "How we do it" and "Our process" illustrations. The raw look is a CSS filter over the finished image, not a real before.
- `tx-ext.jpg` ← Exterior/1.jpg · `tx-int.jpg` ← Interior/1.jpg · `tx-twi.jpg` ← Twilight-and-Day-to-Dusk/1.jpg · `tx-aer.jpg` ← Drone/1.jpg
- Confirm with TechX that the photographers allow web use of these edits.
- Service cards also use `tx-plan.jpg` ← Floor-Plan/1.jpg and `tx-twi2.jpg` ← Twilight-and-Day-to-Dusk/3.jpg (spare, not yet used).
- Hero photo field (`public/photos/field/f01–f18.webp`): 18 old-site portfolio images, resized to 560px wide, WebP q72, metadata stripped (688 KB total, from ~10 MB). f01–f06 Exterior/2,3,5,7,9,12 · f07–f12 Interior/2,3,6,8,10,14 · f13–f15 Twilight-and-Day-to-Dusk/2,4,6 · f16–f18 Drone/3,5,8.
- Work gallery (`public/photos/work/`, 2026-11-02): all 87 old-site portfolio images (techxsystems.com/img/portfolio/<Category>/<n>.jpg), WebP q76, metadata stripped, 800 px wide (6.5 MB total). Names: `ext-1…18` Exterior · `int-1…33` Interior · `twi-1…8` Twilight-and-Day-to-Dusk · `aer-1…15` Drone · `yacht-1…10` Yacht · `plan-1…3` Floor-Plan. Also the About page's stand-in studio photo (`aer-2`). Confirm web use with TechX.
