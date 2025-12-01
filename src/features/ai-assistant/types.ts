export interface AiSource {
  id: string;
  title: string;
  snippet: string;
}

export interface AiAnswerResponse {
  answer: string;
  sources: AiSource[];
}
