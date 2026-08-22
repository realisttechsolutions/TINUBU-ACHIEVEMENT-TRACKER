# PTAT AI UX Specification & Design System
**Document ID**: PTAT-M08C-UX-001  
**Authority**: President Tinubu Achievement Tracker (PTAT)  
**Status**: ACTIVE / CERTIFIED (MINIMAL AI-FIRST OVERRIDE APPLIED)  

---

## 1. UX Design Philosophy: Minimal AI-First Interface

PTAT AI adheres to a **Minimal AI-First Interaction Paradigm** inspired by modern sovereign AI tools (ChatGPT, Claude, Gemini, LM Arena), strictly rejecting dashboard-like empty states, prompt chips, and predefined question cards.

### Core Principles
1. **Immediate Action Clarity**: The user opens `/ai` and immediately understands: *"I type my question here."*
2. **Zero Predefined Question Buttons**: Suggested question tiles, capability cards, example prompts, and category chips equal **0** on the landing screen.
3. **Dominant Hero Composer**: A generous (760–1000px desktop width), multiline input surface with subtle focus glow, clean send button, and zero fake controls.
4. **Natural Conversational Prose First**: Assistant responses read naturally as an intelligent public evidence assistant, using lightweight inline citation chips (`[1]`, `[2]`).
5. **Progressive Evidence Disclosure**: Detailed evidence (sources, records, financials, beneficiaries) discloses on-demand via the collapsible Evidence Rail rather than cluttering the screen preemptively.

---

## 2. Interaction States & Transitions

### 2.1 Opening / Landing State (Zero-State)
- **Visual Centerpiece**:
  - Restrained PTAT AI identity pill: `PTAT AI • Evidence Intelligence`.
  - Dominant, concise heading: `"What would you like to know?"`.
  - Faint, single-sentence context subline: `"Ask anything about achievements, infrastructure projects, statutory policies, and verified public evidence."`.
- **Hero Composer**: Centered within the visual viewport, autofocusing for immediate keyboard entry.
- **Predefined Prompts / Tiles**: **0**.

### 2.2 Active Conversation State
- Smooth transition upon query submission.
- **User Query**: Right-aligned clean bubble with user badge and localized timestamp.
- **Reasoning Pipeline**: `AILoadingState` displays 4 animated reasoning steps with real-time elapsed seconds counter.
- **Assistant Grounded Answer**: Natural prose synthesis with interactive citation chips (`[1]`, `[2]`) linked directly to the evidence panel.
- **Sticky Bottom Composer**: Anchored to bottom of viewport for natural multi-turn follow-ups.

### 2.3 Evidence Rail State
- Opens on demand when user clicks an inline citation or the "Inspect Evidence Rail" trigger.
- Displays verified Level 1 Primary Official Gazettes, publisher metadata, exact source excerpts, and direct outbound links.

---

## 3. Responsive Constraints

- Certified across 390px, 430px, 768px, 1280px, and 1920px viewports.
- Zero horizontal overflow (`overflow-x: hidden`).
- High-contrast electric cyan focus rings and full ARIA keyboard accessibility.
