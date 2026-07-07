// Your source JSON files use inconsistent key naming across languages:
// snake_case (python/c/cpp), camelCase (js), nested "phase_metadata" vs "phaseMetadata", etc.
// This file converts ANY of those shapes into one predictable `NormalizedLesson` object so the
// rest of the app never has to special-case a language.

export interface CodeExample {
  title?: string;
  description?: string;
  code?: string;
  output?: string;
}

export interface QA {
  question: string;
  answer: string;
  difficulty?: string;
  type?: string;
}

export interface MCQ {
  question: string;
  options: Record<string, string> | { key: string; text: string }[];
  answer: string; // normalized to the option key, e.g. "A"
  explanation?: string;
}

export interface NormalizedLesson {
  phaseNumber: number;
  title: string;
  description?: string;
  estimatedTime?: string;
  learningObjectives: string[];
  prerequisites: string[];
  introduction?: string;
  conceptExplanation?: string;
  syntax?: string;
  syntaxBreakdown?: string[];
  rulesAndKeyPoints: string[];
  codeExamples: CodeExample[];
  memoryVisualization?: string;
  realWorldUseCases: string[];
  commonMistakes: string[];
  bestPractices: string[];
  faqs: { question: string; answer: string }[];
  summary?: string;
  keyTakeaways: string[];
  previewNextTopic?: string;
  qaBank: QA[];
  mcqs: MCQ[];
  isFallback: boolean; // flags placeholder/template content so the UI can warn instead of pretending it's real
}

function first(...vals: any[]) {
  for (const v of vals) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

function toArray(val: any): any[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return Object.values(val);
  return [val];
}

function normalizeMcq(raw: any): MCQ | null {
  if (!raw) return null;
  const question = first(raw.question);
  const options = first(raw.options);
  const answer = first(raw.answer, raw.correctAnswer, raw.correctOption);
  if (!question || !options || !answer) return null;
  return {
    question,
    options,
    answer,
    explanation: first(raw.explanation),
  };
}

function normalizeQa(raw: any): QA | null {
  if (!raw) return null;
  const question = first(raw.question);
  const answer = first(raw.answer);
  if (!question || !answer) return null;
  return {
    question,
    answer,
    difficulty: first(raw.difficulty),
    type: first(raw.type, raw.category, raw.topic),
  };
}

function normalizeFaq(raw: any): { question: string; answer: string } | null {
  if (!raw) return null;
  const question = first(raw.question);
  const answer = first(raw.answer);
  if (!question || !answer) return null;
  return { question, answer };
}

function normalizeCodeExample(raw: any): CodeExample | null {
  if (!raw) return null;
  return {
    title: first(raw.title),
    description: first(raw.description, raw.explanation),
    code: first(raw.code, raw.solutionCode, raw.codeTemplate),
    output: first(raw.output, raw.expectedOutput),
  };
}

/**
 * Accepts the raw parsed JSON for ANY phase file (any language) and returns
 * a single consistent shape the UI components can rely on.
 */
export function normalizeLesson(raw: any, fallbackPhaseNumber: number): NormalizedLesson {
  const meta = first(raw.phase_metadata, raw.phaseMetadata, raw.metadata, {});

  const phaseNumber = first(
    meta.phase_number,
    meta.phaseNumber,
    meta.phaseId,
    meta.phase_id,
    fallbackPhaseNumber
  );

  const title = first(meta.title, meta.phase_name, meta.phaseName, `Phase ${phaseNumber}`);

  const rules = first(
    raw.rules_and_key_points,
    raw.rulesAndKeyPoints,
    []
  );

  const codeExamples: CodeExample[] = [];
  const ce1 = normalizeCodeExample(first(raw.code_example_1, raw.codeExample1, raw.codeExample?.[0]));
  const ce2 = normalizeCodeExample(first(raw.code_example_2, raw.codeExample2, raw.codeExample?.[1]));
  if (ce1) codeExamples.push(ce1);
  if (ce2) codeExamples.push(ce2);
  // some files store multiple examples under "code_examples" or "codeExamples" as an array
  const extraExamples = toArray(first(raw.code_examples, raw.codeExamples))
    .map(normalizeCodeExample)
    .filter(Boolean) as CodeExample[];
  for (const ex of extraExamples) {
    if (!codeExamples.find((c) => c.code === ex.code)) codeExamples.push(ex);
  }

  const qaRaw = toArray(
    first(
      raw.questions_and_answers,
      raw.questionsAndAnswers,
      raw.questions,
      raw.codeQuestions,
      []
    )
  );
  const qaBank = qaRaw.map(normalizeQa).filter(Boolean) as QA[];

  const mcqRaw = toArray(
    first(raw.multiple_choice_questions, raw.mcqs, [])
  );
  const mcqs = mcqRaw.map(normalizeMcq).filter(Boolean) as MCQ[];

  const faqRaw = toArray(first(raw.faqs, raw.faq, raw.frequently_asked_questions, raw.frequentlyAskedQuestions, []));
  const faqs = faqRaw.map(normalizeFaq).filter(Boolean) as { question: string; answer: string }[];

  const syntaxBreakdown = first(raw.syntax_breakdown, raw.syntaxBreakdown, raw.breakdown_of_syntax, raw.breakdownOfSyntax);
  const syntaxBreakdownArr: string[] = Array.isArray(syntaxBreakdown)
    ? syntaxBreakdown
    : syntaxBreakdown && typeof syntaxBreakdown === "object"
    ? Object.entries(syntaxBreakdown).map(([k, v]) => `${k}: ${v}`)
    : [];

  const memoryViz = first(raw.memory_visualization, raw.memoryVisualization);
  const memoryVizStr =
    typeof memoryViz === "string" ? memoryViz : memoryViz ? JSON.stringify(memoryViz, null, 2) : undefined;

  return {
    phaseNumber: Number(phaseNumber) || fallbackPhaseNumber,
    title,
    description: first(meta.description),
    estimatedTime: first(meta.estimated_time, meta.estimatedTime, meta.duration),
    learningObjectives: toArray(first(raw.learning_objectives, raw.learningObjectives, [])),
    prerequisites: toArray(first(raw.prerequisites, [])),
    introduction: first(raw.introduction),
    conceptExplanation:
      typeof raw.concept_explanation === "string"
        ? raw.concept_explanation
        : typeof raw.conceptExplanation === "string"
        ? raw.conceptExplanation
        : JSON.stringify(first(raw.concept_explanation, raw.conceptExplanation, ""), null, 2) || undefined,
    syntax: typeof raw.syntax === "string" ? raw.syntax : JSON.stringify(raw.syntax ?? "", null, 2) || undefined,
    syntaxBreakdown: syntaxBreakdownArr,
    rulesAndKeyPoints: Array.isArray(rules) ? rules : toArray(rules),
    codeExamples,
    memoryVisualization: memoryVizStr,
    realWorldUseCases: toArray(first(raw.real_world_use_cases, raw.realWorldUseCases, [])),
    commonMistakes: toArray(
      first(raw.common_mistakes, raw.commonMistakes, raw.common_mistakes_students_make, raw.commonMistakesStudentsMake, [])
    ),
    bestPractices: toArray(first(raw.best_practices, raw.bestPractices, [])),
    faqs,
    summary:
      typeof raw.summary === "string"
        ? raw.summary
        : first(raw.summary?.key_takeaways) !== undefined
        ? undefined
        : undefined,
    keyTakeaways: toArray(first(raw.key_takeaways, raw.keyTakeaways, raw.summary?.key_takeaways, [])),
    previewNextTopic: first(
      raw.preview_next_topic,
      raw.previewNextTopic,
      raw.preview_of_next_topic,
      raw.previewOfNextTopic,
      raw.preview_of_the_next_topic,
      raw.preview_next,
      raw.nextTopicPreview,
      raw.summary?.preview_next_topic
    ),
    qaBank,
    mcqs,
    isFallback: Boolean(raw.isFallback),
  };
}
