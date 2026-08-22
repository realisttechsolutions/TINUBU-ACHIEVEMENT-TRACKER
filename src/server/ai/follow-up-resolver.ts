import type { QueryConstraints, QueryIntent } from '../../types/ai.types';
import { NIGERIAN_STATES, SECTOR_ALIASES } from './intent-classifier';

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ContextualizedQuery {
  effectiveQuery: string;
  inferredState?: string;
  inferredSector?: string;
  inferredEntity?: string;
  isFollowUp: boolean;
}

/**
 * Resolves conversational context from bounded session history.
 *
 * Discipline Invariant:
 * 1. Previous assistant prose NEVER serves as factual authority.
 * 2. Only user intent and focal constraints (state, sector, entity) are carried over.
 * 3. The PTAT database retrieval engine remains the sole authority on facts.
 */
export function resolveConversationContext(
  currentQuery: string,
  history: ConversationTurn[] = []
): ContextualizedQuery {
  const trimmed = currentQuery.trim();
  if (!history || history.length === 0) {
    return {
      effectiveQuery: trimmed,
      isFollowUp: false,
    };
  }

  // Filter only user questions in chronological order
  const userQuestions = history
    .filter((turn) => turn.role === 'user' && turn.content && turn.content.trim())
    .map((turn) => turn.content.trim());

  if (userQuestions.length === 0) {
    return {
      effectiveQuery: trimmed,
      isFollowUp: false,
    };
  }

  const lastUserQuestion = userQuestions[userQuestions.length - 1].toLowerCase();
  const currentLower = trimmed.toLowerCase();

  // Detect explicit state or sector in the previous question
  let previousState: string | undefined;
  for (const [name] of Object.entries(NIGERIAN_STATES)) {
    if (lastUserQuestion.includes(name)) {
      previousState = name.charAt(0).toUpperCase() + name.slice(1);
      break;
    }
  }

  let previousSector: string | undefined;
  for (const [alias, info] of Object.entries(SECTOR_ALIASES)) {
    if (lastUserQuestion.includes(alias) || lastUserQuestion.includes(info.label.toLowerCase())) {
      previousSector = info.code;
      break;
    }
  }

  // Check if current query is an implicit follow-up
  const isFollowUpPattern =
    currentLower.startsWith('what about') ||
    currentLower.startsWith('how about') ||
    currentLower.startsWith('and in') ||
    currentLower.startsWith('what of') ||
    currentLower.startsWith('tell me about the') ||
    currentLower.startsWith('specifically') ||
    currentLower.startsWith('compare that') ||
    currentLower.startsWith('compare with') ||
    currentLower.startsWith('and for') ||
    currentLower.includes('specifically') ||
    currentLower.includes('that') ||
    currentLower.includes('there');

  // Check if current query already specifies a state
  let currentState: string | undefined;
  for (const [name] of Object.entries(NIGERIAN_STATES)) {
    if (currentLower.includes(name)) {
      currentState = name.charAt(0).toUpperCase() + name.slice(1);
      break;
    }
  }

  let effectiveQuery = trimmed;
  let inferredState = currentState;

  if (isFollowUpPattern && !currentState && previousState) {
    inferredState = previousState;
    // Synthesize effective query for database retrieval if needed
    if (
      currentLower.startsWith('what about') ||
      currentLower.startsWith('how about') ||
      currentLower.startsWith('what of')
    ) {
      const topic = trimmed
        .replace(/^(what about|how about|what of)\s+/i, '')
        .replace(/\b(specifically|in particular)\b/gi, '')
        .replace(/[?!.]/g, '')
        .trim();
      effectiveQuery = `${topic} in ${previousState}`;
    } else if (!currentLower.includes(previousState.toLowerCase())) {
      effectiveQuery = `${trimmed} in ${previousState}`;
    }
  }

  return {
    effectiveQuery,
    inferredState,
    inferredSector: previousSector,
    isFollowUp: Boolean(isFollowUpPattern && (previousState || previousSector)),
  };
}
