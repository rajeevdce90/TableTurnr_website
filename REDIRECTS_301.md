# 301 Redirect Mapping (SEO)

Use permanent `301` redirects at the hosting layer so search engines transfer authority from legacy URLs to the new canonical pages.

## Core Blog Consolidation Redirects

- `/blog/48-hours-to-live-first-two-days/` -> `/blog/from-prototype-to-production/`
- `/blog/demo-that-changed-regional-director-meetings/` -> `/blog/from-prototype-to-production/`
- `/blog/ai-in-restaurants-beyond-hype/` -> `/blog/why-restaurant-tech-fails-in-year-one/`
- `/blog/building-for-the-gm-not-the-cto/` -> `/blog/why-restaurant-tech-fails-in-year-one/`
- `/blog/why-restaurants-still-run-on-guesswork-2026/` -> `/blog/data-gaps-restaurant-ops/`
- `/blog/what-200-operators-said-about-time-waste/` -> `/blog/data-gaps-restaurant-ops/`
- `/blog/from-8-to-14-margins-franchise-journey/` -> `/blog/menu-engineering-the-matrix-that-prints-money/`
- `/blog/staff-retention-and-technology-data/` -> `/blog/how-to-reduce-restaurant-labor-costs/`
- `/blog/death-of-the-monthly-pl/` -> `/blog/forecast-accuracy-why-98-changes-everything/`
- `/blog/five-metrics-every-gm-before-9am/` -> `/blog/forecast-accuracy-why-98-changes-everything/`

## Additional Legacy URL Redirects

- `/blog/restaurant-management-tips.html` -> `/blog/restaurant-management-tips/`
- `/blog/how-to-reduce-restaurant-labor-costs.html` -> `/blog/how-to-reduce-restaurant-labor-costs/`
- `/team/` -> `/resources/team/`
- `/case-studies/ihop-franchise/` -> `/customers/ihop-franchise/`

## Nginx Example

```nginx
rewrite ^/blog/48-hours-to-live-first-two-days/?$ /blog/from-prototype-to-production/ permanent;
rewrite ^/blog/demo-that-changed-regional-director-meetings/?$ /blog/from-prototype-to-production/ permanent;
rewrite ^/blog/ai-in-restaurants-beyond-hype/?$ /blog/why-restaurant-tech-fails-in-year-one/ permanent;
rewrite ^/blog/building-for-the-gm-not-the-cto/?$ /blog/why-restaurant-tech-fails-in-year-one/ permanent;
rewrite ^/blog/why-restaurants-still-run-on-guesswork-2026/?$ /blog/data-gaps-restaurant-ops/ permanent;
rewrite ^/blog/what-200-operators-said-about-time-waste/?$ /blog/data-gaps-restaurant-ops/ permanent;
rewrite ^/blog/from-8-to-14-margins-franchise-journey/?$ /blog/menu-engineering-the-matrix-that-prints-money/ permanent;
rewrite ^/blog/staff-retention-and-technology-data/?$ /blog/how-to-reduce-restaurant-labor-costs/ permanent;
rewrite ^/blog/death-of-the-monthly-pl/?$ /blog/forecast-accuracy-why-98-changes-everything/ permanent;
rewrite ^/blog/five-metrics-every-gm-before-9am/?$ /blog/forecast-accuracy-why-98-changes-everything/ permanent;
rewrite ^/blog/restaurant-management-tips\.html$ /blog/restaurant-management-tips/ permanent;
rewrite ^/blog/how-to-reduce-restaurant-labor-costs\.html$ /blog/how-to-reduce-restaurant-labor-costs/ permanent;
rewrite ^/team/?$ /resources/team/ permanent;
rewrite ^/case-studies/ihop-franchise/?$ /customers/ihop-franchise/ permanent;
```

## Validation Checklist

- Run URL Inspection in Google Search Console for the destination URLs.
- Confirm old URLs return `301` (not `200` or `302`).
- Keep destination URLs self-canonical.
- Keep old redirect HTML pages for user fallback, but rely on host-level `301` as primary behavior.
