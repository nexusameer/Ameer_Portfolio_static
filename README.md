# Muhammad Ameer Hamza — Portfolio

Personal portfolio of **Muhammad Ameer Hamza**, DevOps Engineer (AWS). A single-page,
dependency-free static site describing production infrastructure work, lab builds,
experience and stack.

🌐 **Live:** [ameernexus.tech](https://ameernexus.tech)

## Stack

Deliberately minimal — no framework, no build step, no runtime dependencies:

- **HTML** — one `index.html`
- **CSS** — one `assets/css/main.css` (CSS custom properties, dark + light themes,
  `prefers-color-scheme` and `prefers-reduced-motion` aware)
- **JavaScript** — one `assets/js/main.js` (~150 lines of vanilla JS: theme toggle,
  scroll reveal, count-up stats, hero terminal typewriter, copy-to-clipboard)
- **Fonts** — Space Grotesk, Inter and JetBrains Mono via Google Fonts (`display=swap`,
  loaded non-render-blocking)
- **Icons & diagrams** — inline SVG only (tool logos from Simple Icons; architecture
  diagrams hand-drawn as inline SVG)

No Bootstrap, jQuery, carousels, or animation libraries.

## Structure

```
index.html            # the homepage
work/                  # standalone case-study pages
  sentinel.html        #   video-surveillance compliance platform (ECS)
  careintake.html      #   AI-assisted intake platform (ECS + Rekognition/Bedrock)
  petcare.html         #   pet-health platform (ECS + Sidekiq, SES)
  mailcheck.html       #   email-verification SaaS (EC2 ASG + CodeDeploy)
  ec2-vs-ecs.html      #   EC2 + CodeDeploy vs ECS Fargate comparison
assets/css/main.css    # styles + theme tokens
assets/js/main.js      # behaviour
images/                # profile photo (WebP), favicons, og.png (social card)
sitemap.xml            # home + 5 work pages
robots.txt             # points crawlers at the sitemap
CNAME                  # custom domain
.github/workflows/     # deployment (do not edit by hand)
```

## Local preview

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>.

## Quality

Lighthouse (desktop): Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100.
Fully responsive (360 → 1440px), keyboard-navigable, with a JSON-LD `Person` schema and
Open Graph / Twitter card metadata.

## Contact

- Email: nexusameer@gmail.com
- GitHub: [github.com/nexusameer](https://github.com/nexusameer)
- LinkedIn: [linkedin.com/in/nexusameer](https://www.linkedin.com/in/nexusameer)
