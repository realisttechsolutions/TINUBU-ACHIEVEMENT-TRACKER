# TAT Analytics Event Plan
## Google Analytics 4 & Next.js App Router Interaction Telemetry

**Status:** APPROVED  
**Standard:** Google Analytics 4 (GA4) / Google Tag Manager  

---

## 1. Core Event Tracking Matrix

| Event Name | Trigger | Custom Parameters |
| :--- | :--- | :--- |
| `page_view` | Next.js App Router route transition | `page_path`, `page_title`, `page_location` |
| `achievement_view` | User opens `/achievements/[slug]` or drawer | `achievement_id`, `sector_id`, `publication_status` |
| `policy_view` | User opens `/policies/[slug]` | `policy_id`, `legal_authority`, `sector_id` |
| `state_select` | User clicks state on Nigeria Vector Map | `state_code`, `state_name`, `geo_zone` |
| `filter_applied` | User filters achievements/policies/sectors | `filter_type`, `filter_value`, `result_count` |
| `search_query` | User executes search via SearchModal | `search_term`, `result_count`, `search_category` |
| `evidence_drawer_open` | User clicks "Verify Evidence" on achievement | `achievement_id`, `source_count`, `gazette_ref` |
| `data_export` | User downloads CSV/JSON/PDF data | `export_format`, `dataset_name`, `item_count` |
| `language_change` | User switches language selector | `previous_language`, `selected_language` |
| `correction_submitted` | User submits a public correction request | `entity_type`, `entity_id`, `has_evidence_attachment` |