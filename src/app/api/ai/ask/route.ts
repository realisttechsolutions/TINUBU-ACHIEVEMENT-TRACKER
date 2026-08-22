import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/server/db/pool';
import { PTATGroundedSynthesisService } from '@/server/ai/grounded-synthesis';
import { resolveConversationContext, type ConversationTurn } from '@/server/ai/follow-up-resolver';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;
const MAX_TURN_CONTENT_LENGTH = 500;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json.', code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object.', code: 'INVALID_REQUEST_BODY' },
        { status: 400 }
      );
    }

    // Security check: Reject forbidden client overrides
    if (
      'model' in body ||
      'systemInstruction' in body ||
      'vertexConfig' in body ||
      'temperature' in body ||
      'credentials' in body
    ) {
      return NextResponse.json(
        { error: 'Client overrides for model parameters are strictly prohibited.', code: 'FORBIDDEN_PARAMETER' },
        { status: 400 }
      );
    }

    const rawQuestion = body.question;
    if (typeof rawQuestion !== 'string') {
      return NextResponse.json(
        { error: 'The "question" field is required and must be a string.', code: 'MISSING_QUESTION' },
        { status: 400 }
      );
    }

    const question = rawQuestion.trim();
    if (question.length === 0) {
      return NextResponse.json(
        { error: 'Question cannot be empty.', code: 'EMPTY_QUESTION' },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        {
          error: `Question exceeds maximum allowed length of ${MAX_QUESTION_LENGTH} characters.`,
          code: 'QUESTION_TOO_LONG',
        },
        { status: 400 }
      );
    }

    // Bounded conversation history validation
    let sanitizedHistory: ConversationTurn[] = [];
    if (Array.isArray(body.conversationHistory)) {
      sanitizedHistory = body.conversationHistory
        .slice(-MAX_HISTORY_TURNS)
        .filter(
          (turn): turn is ConversationTurn =>
            Boolean(turn) &&
            typeof turn === 'object' &&
            (turn.role === 'user' || turn.role === 'assistant') &&
            typeof turn.content === 'string' &&
            turn.content.trim().length > 0
        )
        .map((turn) => ({
          role: turn.role,
          content: turn.content.trim().slice(0, MAX_TURN_CONTENT_LENGTH),
        }));
    }

    // Resolve conversational follow-up context (e.g. state or topic continuity)
    const contextual = resolveConversationContext(question, sanitizedHistory);

    // Initialize grounded synthesis with authoritative Cloud SQL connection
    const db = await getDatabaseConnection();
    const synthesisService = new PTATGroundedSynthesisService(db);

    const answer = await synthesisService.answerQuestion(contextual.effectiveQuery);

    return NextResponse.json(answer, { status: 200 });
  } catch (error: any) {
    console.error('PTAT AI Ask API Error:', {
      name: error?.name,
      message: error?.message,
    });

    return NextResponse.json(
      {
        error: 'Unable to process intelligence query at this time. Please try again shortly.',
        code: 'INTERNAL_SYNTHESIS_ERROR',
      },
      { status: 500 }
    );
  }
}
