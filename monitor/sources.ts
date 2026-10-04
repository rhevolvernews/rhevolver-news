import sources from "./sources-config.json";
export type Source = { id: string; name: string; url: string; scope: "iguala" | "guerrero" | "federal" | "sports"; priority: number; kind: "official"; adapter?: "direct" | "indexed-official"; officialHost?: string };
export const monitorSources = sources as Source[];
