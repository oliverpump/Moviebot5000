import { WatchedMovie, MovieSuggestion } from "../types";

// This is the URL of the function we will deploy.
// The '/generate' part matches the name of the exported function in `functions/src/index.ts`.
const API_ENDPOINT = `/generate`; 

const suggestionsSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING", description: "The title of the movie." },
      synopsis: { type: "STRING", description: "A brief, one-sentence synopsis of the movie." },
      year: { type: "STRING", description: "The release year of the movie." },
      genre: { type: "STRING", description: "The primary genre of the movie (e.g., Sci-Fi, Thriller, Comedy)." },
      posterUrl: { type: "STRING", description: "A publicly accessible URL to the movie's poster image." },
    },
    required: ["title", "synopsis", "year", "genre", "posterUrl"],
  },
};

const movieInfoSchema = {
    type: "OBJECT",
    properties: {
        title: { type: "STRING", description: "The official title of the movie." },
        year: { type: "STRING", description: "The release year of the movie." },
    },
    required: ["title", "year"],
};

const movieSuggestionDetailsSchema = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING", description: "The title of the movie." },
      synopsis: { type: "STRING", description: "A brief, one-sentence synopsis of the movie." },
      year: { type: "STRING", description: "The release year of the movie." },
      genre: { type: "STRING", description: "The primary genre of the movie (e.g., Sci-Fi, Thriller, Comedy)." },
      posterUrl: { type: "STRING", description: "A publicly accessible URL to the movie's poster image." },
    },
    required: ["title", "synopsis", "year", "genre", "posterUrl"],
};

// A helper function to call our new Firebase Function
async function callApi<T>(prompt: string, schema: any): Promise<T> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, schema }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API call failed:", errorBody);
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const jsonText = await response.text();
  return JSON.parse(jsonText) as T;
}


export async function getMovieSuggestions(watchedMovies: WatchedMovie[], vetoedMovies: MovieSuggestion[], alreadyConsidered: MovieSuggestion[]): Promise<Omit<MovieSuggestion, 'votes'>[]> {
  const movieListString = watchedMovies
    .map(m => `${m.title} (${m.year})${m.rating ? ` - Rated ${m.rating}/5` : ''}`)
    .join(', ');

  const consideredListString = alreadyConsidered.length > 0
    ? `Also, do not suggest any of the following movies as they have already been considered: ${[...new Set(alreadyConsidered.map(m => m.title))].join(', ')}.`
    : '';
    
  const vetoedListString = vetoedMovies.length > 0
    ? `Crucially, the group has explicitly vetoed the following movies, so avoid suggesting anything with a similar tone, genre, or quality: ${vetoedMovies.map(m => m.title).join(', ')}.`
    : '';

  const prompt = `
    Based on the following list of movies that a group of friends has watched, along with their ratings (from 1 to 5, where 5 is best):
    ${movieListString || 'No movies watched yet.'}. They are fans of "trash cinema" and "bad movies", so feel free to suggest cult classics, B-movies, and movies that are "so bad they're good".

    Please suggest 3 new movies for them to watch next.
    - Give strong preference to movies similar to those rated 4 or 5.
    - Suggest a diverse range of genres that align with the highly-rated movies.
    - Avoid suggesting movies similar to those rated 1 or 2.
    - The suggestions must be unique and not from the watched list.
    ${vetoedListString}
    ${consideredListString}

    For each movie, provide a title, a brief one-sentence synopsis, its release year, its primary genre, and a publicly accessible URL for its poster image.
  `;

  try {
    const suggestions = await callApi<Omit<MovieSuggestion, 'votes'>[]>(prompt, suggestionsSchema);
    if (!Array.isArray(suggestions) || suggestions.some(s => typeof s.title !== 'string' || typeof s.synopsis !== 'string' || typeof s.year !== 'string' || typeof s.genre !== 'string' || typeof s.posterUrl !== 'string')) {
        throw new Error("Invalid response format from API.");
    }
    return suggestions;
  } catch (error) {
    console.error("Error fetching movie suggestions:", error);
    throw new Error("Failed to get movie suggestions from the AI. Please try again.");
  }
}

export async function findMovieInfo(title: string): Promise<{ title: string; year: string } | null> {
    const prompt = `Find the movie titled "${title}". Respond ONLY with JSON containing its official title and release year.`;
    try {
        const details = await callApi<{ title: string; year: string }>(prompt, movieInfoSchema);
        if (details && typeof details.title === 'string' && typeof details.year === 'string') {
            return details;
        }
        return null;
    } catch (error) {
        console.error(`Error finding movie info for "${title}":`, error);
        return null;
    }
}

export async function getMovieSuggestionDetails(title: string): Promise<Omit<MovieSuggestion, 'votes'> | null> {
    const prompt = `Find the movie titled "${title}". Respond ONLY with JSON containing its title, a one-sentence synopsis, release year, primary genre, and a public poster image URL.`;
    try {
        const details = await callApi<Omit<MovieSuggestion, 'votes'>>(prompt, movieSuggestionDetailsSchema);
        if (details && typeof details.title === 'string' && typeof details.synopsis === 'string' && typeof details.year === 'string' && typeof details.genre === 'string' && typeof details.posterUrl === 'string') {
            return details;
        }
        return null;
    } catch (error) {
        console.error(`Error finding movie details for "${title}":`, error);
        return null;
    }
}