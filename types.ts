export interface WatchedMovie {
  id: string;
  title: string;
  year: string;
  rating: number | null;
}

export type Vote = 'yes' | 'maybe' | 'no' | null;

export interface MovieSuggestion {
  title: string;
  synopsis: string;
  year: string;
  genre: string;
  posterUrl: string;
  votes: Record<string, Vote>; // userName: vote
}
