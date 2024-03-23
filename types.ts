export interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

export interface Project {
  title: string;
  description: string;
  youtubeLink: string;
}

// TODO: Add the types for the photos and experiences
export interface Photo {
  [key: string]: string;
}

export interface Experience {
  [key: string]: string;
}
