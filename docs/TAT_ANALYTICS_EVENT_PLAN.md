# Analytics Event Plan — Tinubu Achievement Tracker V2

This document defines the semantic event taxonomy for tracking user engagement across the public homepage and platform features without compromising user privacy.

---

## 1. Homepage Event Taxonomy

| Event Name | Trigger Context | Payload Metadata |
| :--- | :--- | :--- |
| `homepage_hero_primary_click` | User clicks "Explore Achievements" in Hero | `{ destination: "/dashboard" }` |
| `homepage_hero_secondary_click` | User clicks "View Executive Dashboard" in Hero | `{ destination: "/dashboard" }` |
| `homepage_metric_evidence_click` | User clicks evidence link on a headline Metric Card | `{ metric_id: string, source_name: string }` |
| `homepage_achievement_click` | User clicks on a Featured Achievement card | `{ achievement_id: string, sector: string }` |
| `homepage_sector_click` | User clicks a Sector Explorer card | `{ sector_id: string, path: string }` |
| `homepage_impact_zone_click` | User interacts with a Geopolitical Zone summary | `{ zone_name: string }` |
| `homepage_timeline_event_click` | User views or clicks a Timeline event | `{ event_id: string, sector: string }` |
| `homepage_data_story_chart_hover` | User inspects a Time-Series trend chart | `{ chart_type: "gdp" \| "fdi" }` |
| `homepage_methodology_click` | User clicks "Explore Data & Methodology" | `{ destination: "/data-sources" }` |
| `homepage_reports_cta_click` | User clicks "Browse Reports & Downloads" | `{ destination: "/downloads" }` |

---

## 2. Privacy & Compliance Rules
- Zero Personally Identifiable Information (PII) is captured or transmitted.
- Tracking hooks rely on anonymous custom events dispatched on `window` for third-party analytics adapters.
