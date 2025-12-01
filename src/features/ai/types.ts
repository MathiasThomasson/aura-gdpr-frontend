export type AiSource = {
  id: string;
  title: string;
  snippet?: string;
  url?: string;
};

export type AiError = {
  message: string;
  status?: number;
};

export type AiRequestState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export const mapSources = (value: unknown): AiSource[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item !== 'object' || !item) return null;
      const payload = item as Record<string, unknown>;
      const id =
        typeof payload.id === 'string'
          ? payload.id
          : typeof (payload as { _id?: unknown })._id === 'string'
            ? (payload as { _id: string })._id
            : undefined;
      if (!id) return null;
      return {
        id,
        title: typeof payload.title === 'string' ? payload.title : 'Source',
        snippet: typeof payload.snippet === 'string' ? payload.snippet : undefined,
        url: typeof payload.url === 'string' ? payload.url : undefined,
      };
    })
    .filter((source): source is AiSource => Boolean(source?.id));
};
