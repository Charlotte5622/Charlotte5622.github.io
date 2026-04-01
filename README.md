# Tongrui Zhang's Academic Homepage

This repository contains my personal academic homepage for research in computer vision and deep learning.

## Overview

The site is designed as a lightweight, static academic homepage with:

- a responsive two-column layout
- a refined top navigation bar
- expandable sections for different academic stages
- a dedicated `Research Outputs` area for papers and patents
- mobile-friendly presentation for desktop, tablet, and phone screens

## Tech Stack

- HTML
- CSS
- JavaScript
- Bootstrap
- Markdown content files loaded at runtime

No build step is required. The site can be deployed directly with GitHub Pages.

## Project Structure

```text
.
|-- contents
|   |-- config.yml
|   |-- home.md
|   |-- publications.md
|   |-- awards.md
|   `-- experience.md
|-- static
|   |-- assets
|   |   |-- favicon.ico
|   |   |-- files
|   |   `-- img
|   |-- css
|   |   |-- styles.css
|   |   `-- main.css
|   `-- js
|       |-- scripts.js
|       `-- ...
|-- index.html
`-- README.md
```

## Content Mapping

The homepage content is organized as follows:

- `contents/config.yml`
  Site title, sidebar information, copyright, and academic profile links

- `contents/home.md`
  Introductory homepage text

- `contents/publications.md`
  Research outputs section, including paper cards and patent entries

- `contents/awards.md`
  Undergraduate background and academic record

- `contents/experience.md`
  Ph.D.-stage placeholder and future updates

## How To Update

### 1. Update personal profile

Edit `contents/config.yml` to change:

- page title
- sidebar name
- affiliation
- location
- email
- GitHub / Google Scholar / ORCID / ResearchGate links

### 2. Update homepage introduction

Edit `contents/home.md`.

### 3. Update research outputs

Edit `contents/publications.md`.

The paper card area is already styled as a figure slot for real paper images. To replace the placeholder:

1. put your paper figure into `static/assets/img/research/`
2. replace the placeholder block in `contents/publications.md` with an actual `<img>` tag
3. keep the surrounding `publication-item` structure unchanged for best layout results

Patent covers and downloadable files are organized separately:

- patent cover images: `static/assets/img/research/`
- patent or supplementary PDFs: `static/assets/files/research/`

### 4. Update undergraduate or Ph.D. sections

Edit:

- `contents/awards.md`
- `contents/experience.md`

### 5. Replace avatar and other images

Suggested files:

- avatar: `static/assets/img/photo.png`
- research figures and covers: `static/assets/img/research/`
- downloadable research files: `static/assets/files/research/`

## Local Preview

You can preview the site locally with a simple static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deployment

This project is suitable for GitHub Pages deployment.

### Recommended setup

If you want your homepage to be served as:

```text
https://<username>.github.io/
```

name the repository:

```text
<username>.github.io
```

### GitHub Pages settings

In GitHub:

1. Open `Settings`
2. Go to `Pages`
3. Set `Source` to `Deploy from a branch`
4. Select branch `main`
5. Select folder `/ (root)`

Then push your latest changes:

```bash
git add .
git commit -m "update homepage"
git push origin main
```

## Notes

- The site is fully static and easy to maintain
- The navigation and layout are optimized for mobile devices
- The paper figure area is intentionally reserved for real research images
- Patent PDFs can be served as direct-download resources
- If DOI, code, or publication links are not yet public, placeholder text can be used temporarily

## License

This repository includes the original open-source template license and has been customized for personal academic use.
