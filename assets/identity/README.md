# Personal logo

`logo-outline.svg` and `logo-solid.svg` are unchanged copies of the supplied
`logo.svg` and `business card.svg`. The solid version supplies the website and
iOS icons, preserving its polygon geometry, white strokes, and `#d71718` red.

Run `npm run icons:generate` from the repository root to regenerate:

- `public/favicon.svg` and `public/favicon.ico` (16, 32, and 48 pixels)
- `public/apple-touch-icon.png` (180 pixels)
- `ios/Portfolio/PortfolioGlass.icon/Assets/logo-glass.png` (1024 pixels, transparent native foreground)
- `ios/IconArtwork/logo-glass.svg` (editable vector mask source)

The generator crops the original business-card canvas to the artwork's bounds,
then centers it on a white square for the website. The native foreground occupies
60% of the canvas and uses the source white seams as transparent separations.
`PortfolioGlass.icon` supplies native Liquid Glass rendering, with a neutral
automatic gradient, 20% translucency, and 25% shadow opacity. Website links live
in `app/layout.tsx`; website artwork is unchanged by the native glass revision.
