# PTAT AI Conversational UX Specification

## Visual Design & Interaction

PTAT AI's interface provides a clean, AI-native conversational workspace modeled on modern conversational intelligence design systems.

### Conversational Architecture

1. **User Message Bubble**:
   - Clean, compact message container aligned to the right.
   - Preserved in conversation view throughout follow-up turns.

2. **Transparent Assistant Prose Area**:
   - Answer appears directly below user prompt in high-contrast, comfortable typography.
   - Eliminates monolithic dashboard boxes and heavy grounding status banners.

3. **Subtle Source Disclosure**:
   - A compact `Sources · N` indicator is anchored under the completed prose.
   - Clicking expands an interactive grid displaying verified publisher details, titles, and live links.

4. **Contextual Structured Highlights**:
   - Financial summaries (Naira-first), beneficiary cohorts, and linked catalog records are rendered cleanly in expandable secondary cards without competing with primary prose.

5. **Auto-Follow & Viewport Management**:
   - On submit, viewport scrolls smoothly to the beginning of the new assistant response.
   - While text streams, auto-follow gently tracks incoming chunks if the user remains near the bottom.
   - If the user scrolls upward to read earlier content, auto-follow disengages and displays a floating `↓ Latest` button.
