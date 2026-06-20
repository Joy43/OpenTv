import { Channel, Playlist, DRMInfo } from "@/types/playlist";
import { fetchPlaylistNative } from "../../modules/tv-player/src/index";

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/** Stable ID derived from a channel's stream URL so it survives playlist refreshes. */
function stableChannelId(url: string): string {
  let h = 5381;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) + h) ^ url.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  return "ch_" + h.toString(36);
}

function autoGroupChannel(channelName: string, parsedGroup?: string): string {
  const group = (parsedGroup || "").trim();
  const name = channelName.toLowerCase();
  const groupLower = group.toLowerCase();

  const matches = (str: string, keywords: string[]) => {
    return keywords.some((keyword) => str.includes(keyword));
  };

  // Keywords lists
  const sportsKeywords = [
    "sport",
    "espn",
    "football",
    "soccer",
    "cricket",
    "nba",
    "nfl",
    "golf",
    "ufc",
    "wwe",
    "tennis",
    "match",
    "racing",
    "be in",
    "bein",
    "sky sp",
    "supersport",
    "arena",
    "athletics",
    "basketball",
  ];
  const moviesKeywords = [
    "movie",
    "cinema",
    "hbo",
    "action",
    "film",
    "thriller",
    "cine",
    "star gold",
    "sony max",
    "zee cinema",
    "premium play",
    "hallmark",
    "paramount",
    "box office",
    "blockbusters",
    "movies",
  ];
  const musicKeywords = [
    "music",
    "mtv",
    "radio",
    "song",
    "melody",
    "rock",
    "pop",
    "jazz",
    "vh1",
    "tunes",
    "musical",
  ];
  const newsKeywords = [
    "news",
    "cnn",
    "bbc",
    "msnbc",
    "fox",
    "cnbc",
    "al jazeera",
    "reuters",
    "bloomberg",
    "weather",
    "cctv",
    "euronews",
    "sky news",
    "press",
    "daily",
  ];
  const kidsKeywords = [
    "kid",
    "cartoon",
    "disney",
    "nickelodeon",
    "nick",
    "junior",
    "boomer",
    "toon",
    "baby",
    "anime",
    "discovery kids",
    "family",
    "kids",
  ];
  const docKeywords = [
    "docu",
    "discovery",
    "national geo",
    "nat geo",
    "history",
    "science",
    "animal",
    "nature",
    "wild",
    "space",
    "earth",
    "curiosity",
    "planet",
    "geo",
    "travel",
    "adventure",
  ];
  const entKeywords = [
    "show",
    "comedy",
    "ent",
    "reality",
    "star plus",
    "colors",
    "sony",
    "zee",
    "drama",
    "hgtv",
    "tlc",
    "food",
    "lifestyle",
    "fashion",
    "leisure",
    "premium",
    "gold",
    "series",
    "serial",
    "style",
  ];
  const genKeywords = [
    "general",
    "main",
    "basic",
    "channel",
    "local",
    "broadcast",
    "public",
    "network",
    "general tv",
    "mixed",
    "variety",
    "standard",
  ];
  const intKeywords = [
    "international",
    "global",
    "world",
    "foreign",
    "french",
    "spanish",
    "arabic",
    "hindi",
    "german",
    "italian",
    "russian",
    "turkish",
    "asian",
    "european",
    "latam",
    "int",
    "globe",
  ];
  const fitKeywords = [
    "fitness",
    "health",
    "gym",
    "yoga",
    "workout",
    "wellness",
    "fit",
    "medical",
    "exercise",
    "aerobics",
    "body",
    "mind",
    "healthy",
  ];

  const xxxKeywords = [
    "xxx",
    "adult",
    "erotic",
    "pink",
    "porn",
    "18+",
    "redlight",
    "red light",
    "sensual",
    "for adult",
    "hustler",
    "playboy",
    "penthouse",
    "dorcel",
    "brazzers",
    "xx",
  ];

  const hasSexWord = (str: string) => {
    const tokens = str.split(/[\s\-_\.\/]+/);
    return (
      tokens.includes("sex") ||
      tokens.includes("sexo") ||
      tokens.includes("sexy") ||
      tokens.includes("sexys")
    );
  };

  // Try matching against group title first
  if (group && groupLower !== "uncategorized") {
    if (matches(groupLower, xxxKeywords) || hasSexWord(groupLower)) return "🔞 XXX";
    if (matches(groupLower, sportsKeywords)) return "⚽ Sports";
    if (matches(groupLower, moviesKeywords)) return "🎬 Movies";
    if (matches(groupLower, musicKeywords)) return "🎵 Music";
    if (matches(groupLower, newsKeywords)) return "📰 News";
    if (matches(groupLower, kidsKeywords)) return "👶 Kids";
    if (matches(groupLower, docKeywords)) return "🌍 Documentary";
    if (matches(groupLower, entKeywords)) return "🎭 Entertainment";
    if (matches(groupLower, genKeywords)) return "📺 General TV";
    if (matches(groupLower, intKeywords)) return "📡 International";
    if (matches(groupLower, fitKeywords)) return "🏋️ Fitness / Health";

    // If custom group exists but didn't match standard keywords, preserve it as-is
    return group;
  }

  // Fallback to matching against channel name keywords
  if (matches(name, xxxKeywords) || hasSexWord(name)) return "🔞 XXX";
  if (matches(name, sportsKeywords)) return "⚽ Sports";
  if (matches(name, moviesKeywords)) return "🎬 Movies";
  if (matches(name, musicKeywords)) return "🎵 Music";
  if (matches(name, newsKeywords)) return "📰 News";
  if (matches(name, kidsKeywords)) return "👶 Kids";
  if (matches(name, docKeywords)) return "🌍 Documentary";
  if (matches(name, entKeywords)) return "🎭 Entertainment";
  if (matches(name, genKeywords)) return "📺 General TV";
  if (matches(name, intKeywords)) return "📡 International";
  if (matches(name, fitKeywords)) return "🏋️ Fitness / Health";

  return "Uncategorized";
}

function parseDRM(
  lines: string[],
  currentIndex: number,
  _url: string,
): { drm?: DRMInfo; headers?: Record<string, string> } {
  const drm: DRMInfo = {};
  const headers: Record<string, string> = {};
  let foundDRM = false;
  let foundHeaders = false;

  // Search both before AND after the URL line within a reasonable window.
  // Some providers place #KODIPROP tags after #EXTINF but before the URL,
  // while others may interleave them with other metadata lines.
  // We scan 30 lines before the URL and up to 5 lines after (the URL itself
  // is at currentIndex, so lines[currentIndex] is the URL — skip it).
  const windowStart = Math.max(0, currentIndex - 30);
  const windowEnd = Math.min(lines.length - 1, currentIndex + 5);

  for (let i = windowStart; i <= windowEnd; i++) {
    if (i === currentIndex) continue; // skip the URL line itself
    const line = lines[i];

    if (line.includes("#KODIPROP:inputstream.adaptive.license_type=")) {
      // Use slice(1).join("=") to correctly handle type strings that might
      // theoretically contain "=" — keeps parity with the license_key parsing.
      const typeRaw = line.split("=").slice(1).join("=").toLowerCase().trim();
      if (typeRaw.includes("widevine")) drm.type = "widevine";
      else if (typeRaw.includes("playready")) drm.type = "playready";
      else if (typeRaw.includes("clearkey")) drm.type = "clearkey";
      else if (typeRaw.includes("fairplay")) drm.type = "fairplay";
      else {
        // Unknown DRM type — set a flag so we know DRM was declared even if
        // we can't map it. Callers will see foundDRM=true but drm.type=undefined
        // and can handle it (e.g. log a warning) rather than silently proceeding.
      }
      foundDRM = true;
    }

    if (line.includes("#KODIPROP:inputstream.adaptive.license_key=")) {
      drm.licenseServer = line.split("=").slice(1).join("=").trim();
      foundDRM = true;
    }

    if (line.includes("#EXTVLCOPT:http-user-agent=")) {
      headers["User-Agent"] = line.split("=").slice(1).join("=").trim();
      foundHeaders = true;
    }

    if (line.includes("#EXTVLCOPT:http-referrer=")) {
      headers["Referer"] = line.split("=").slice(1).join("=").trim();
      foundHeaders = true;
    }

    if (line.includes("#EXTVLCOPT:http-origin=")) {
      headers["Origin"] = line.split("=").slice(1).join("=").trim();
      foundHeaders = true;
    }
  }

  // NOTE: Akamai token-auth parameters (`hdnea`, `hdntl`) are CDN access
  // tokens — they protect the stream delivery at the CDN layer and are NOT
  // related to EME/CDM DRM (Widevine/PlayReady/ClearKey). We deliberately do
  // NOT treat them as a DRM signal. If present they should be forwarded as
  // request headers or kept as URL query parameters, not used to configure a
  // DRM session. Removed previous incorrect behaviour that set drm.type =
  // "widevine" when hdnea was detected.

  // Attach headers to DRM object for license requests
  if (foundDRM && foundHeaders) {
    drm.headers = headers;
  }

  return {
    drm: foundDRM ? drm : undefined,
    headers: foundHeaders ? headers : undefined,
  };
}

/**
 * Parses VLC-style URL headers (e.g., `http://stream.url|User-Agent:foo|Referer:bar`)
 * Returns the clean URL and a headers record.
 */
function parseUrlHeaders(url: string): {
  cleanUrl: string;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = {};
  let cleanUrl = url;

  const pipeIndex = url.indexOf("|");
  if (pipeIndex !== -1) {
    cleanUrl = url.substring(0, pipeIndex);
    const headerPart = url.substring(pipeIndex + 1);
    const headerEntries = headerPart.split("|");
    for (const entry of headerEntries) {
      const colonIndex = entry.indexOf(":");
      if (colonIndex !== -1) {
        const headerName = entry.substring(0, colonIndex).trim();
        const headerValue = entry.substring(colonIndex + 1).trim();
        if (headerName && headerValue) {
          // Normalize common header names
          const normalized =
            headerName.toLowerCase() === "user-agent"
              ? "User-Agent"
              : headerName.toLowerCase() === "referer"
                ? "Referer"
                : headerName.toLowerCase() === "origin"
                  ? "Origin"
                  : headerName;
          headers[normalized] = headerValue;
        }
      }
    }
  }

  return { cleanUrl, headers };
}

function parseExtInf(line: string): Partial<Channel> {
  const channel: Partial<Channel> = {};

  const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
  if (tvgIdMatch) channel.tvgId = tvgIdMatch[1];

  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
  if (tvgNameMatch) channel.tvgName = tvgNameMatch[1];

  const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/i);
  if (tvgLogoMatch) channel.logo = tvgLogoMatch[1];

  const groupMatch = line.match(/group-title="([^"]*)"/i);
  if (groupMatch) channel.group = groupMatch[1];

  const qualityMatch = line.match(
    /\b(4K|UHD|FHD|HD|SD|720p|1080p|480p|360p)\b/i,
  );
  if (qualityMatch) channel.quality = qualityMatch[1].toUpperCase();

  // Extract http-user-agent and http-referrer attributes from EXTINF line
  // (some playlists put them here instead of using #EXTVLCOPT lines)
  const userAgentMatch = line.match(/http-user-agent="([^"]*)"/i);
  if (userAgentMatch) {
    channel.headers = channel.headers || {};
    channel.headers["User-Agent"] = userAgentMatch[1];
  }

  const referrerMatch = line.match(/http-referrer="([^"]*)"/i);
  if (referrerMatch) {
    channel.headers = channel.headers || {};
    channel.headers["Referer"] = referrerMatch[1];
  }

  const nameMatch = line.match(/,(.+)$/);
  if (nameMatch) channel.name = nameMatch[1].trim();

  return channel;
}

export function parseM3U(
  content: string,
  playlistName: string = "My Playlist",
): Playlist {
  const lines = content.split("\n").map((line) => line.trim());
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();

  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#EXTINF:")) {
      currentChannel = parseExtInf(line);
    } else if (line && !line.startsWith("#") && currentChannel.name) {
      const { drm, headers: drmHeaders } = parseDRM(lines, i, line);

      const { cleanUrl, headers: urlHeaders } = parseUrlHeaders(line);

      // Merge headers from all sources (priority: URL syntax > EXTVLCOPT > EXTINF attributes)
      const extinfHeaders = currentChannel.headers || {};
      const mergedHeaders = {
        ...extinfHeaders,
        ...(drmHeaders || {}),
        ...urlHeaders,
      };
      const finalHeaders =
        Object.keys(mergedHeaders).length > 0 ? mergedHeaders : undefined;

      const channel: Channel = {
        id: stableChannelId(cleanUrl),
        name: currentChannel.name || "Unknown Channel",
        url: cleanUrl,
        logo: currentChannel.logo,
        group: autoGroupChannel(
          currentChannel.name || "Unknown Channel",
          currentChannel.group,
        ),
        tvgId: currentChannel.tvgId,
        tvgName: currentChannel.tvgName,
        quality: currentChannel.quality,
        drm: drm,
        headers: finalHeaders,
        isLive: true,
      };

      channels.push(channel);
      categoriesSet.add(channel.group);
      currentChannel = {};
    }
  }

  const categories = Array.from(categoriesSet).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return {
    id: generateId(),
    name: playlistName,
    channels,
    categories,
    lastUpdated: Date.now(),
  };
}

export const PRYSM_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchPlaylistContent(url: string): Promise<string | null> {
  try {
    // Try native OkHttp fetch first (properly handles User-Agent on Android)
    const result = await fetchPlaylistNative(url);
    if (result.success) {
      const content = result.content;
      if (content.includes("#EXTM3U") || content.includes("#EXTINF")) {
        return content;
      }
    }
  } catch {
    // Native fetch unavailable or failed, fall through to JS fetch
  }

  // Fallback: JS fetch (may strip User-Agent on some RN versions)
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": PRYSM_USER_AGENT,
        Accept: "*/*",
      },
    });
    if (response.ok) {
      const content = await response.text();
      if (content.includes("#EXTM3U") || content.includes("#EXTINF")) {
        return content;
      }
    }
  } catch {
    // Both fetch methods failed
  }
  return null;
}

export async function fetchAndParseM3U(
  url: string,
  customName?: string,
): Promise<Playlist> {
  const content = await fetchPlaylistContent(url);

  if (!content) {
    throw new Error(
      "Could not fetch playlist. The server may be blocking requests or require specific app authentication.",
    );
  }

  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1]
    .split("?")[0]
    .replace(".m3u", "")
    .replace(".m3u8", "");
  const playlistName = customName || fileName || "Remote Playlist";

  const playlist = parseM3U(content, playlistName);
  playlist.url = url;

  return playlist;
}

/**
 * Parses PLS (Playlist) format
 * Example:
 * [playlist]
 * NumberOfEntries=2
 * File1=http://stream1.url
 * Title1=Channel 1
 * Length1=-1
 */
export function parsePLS(
  content: string,
  playlistName: string = "My Playlist",
): Playlist {
  const lines = content.split("\n").map((line) => line.trim());
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();

  let currentTitle = "";
  let currentGroup = "";

  for (const line of lines) {
    if (line.toLowerCase().startsWith("file")) {
      const urlMatch = line.match(/file\d*=(.+)/i);
      if (urlMatch) {
        const url = urlMatch[1].trim();
        const { cleanUrl, headers: urlHeaders } = parseUrlHeaders(url);
        const channel: Channel = {
          id: stableChannelId(cleanUrl),
          name: currentTitle || "Unknown Channel",
          url: cleanUrl,
          logo: undefined,
          group: autoGroupChannel(
            currentTitle || "Unknown Channel",
            currentGroup,
          ),
          tvgId: undefined,
          tvgName: undefined,
          quality: undefined,
          drm: undefined,
          headers: Object.keys(urlHeaders).length > 0 ? urlHeaders : undefined,
          isLive: true,
        };
        channels.push(channel);
        categoriesSet.add(channel.group);
        currentTitle = "";
      }
    } else if (line.toLowerCase().startsWith("title")) {
      const titleMatch = line.match(/title\d*=(.+)/i);
      if (titleMatch) {
        currentTitle = titleMatch[1].trim();
        // Try to extract group from title if it has a format like "Group - Channel"
        const groupMatch = currentTitle.match(/^(.+?)\s*[-–—]\s*(.+)$/);
        if (groupMatch) {
          currentGroup = groupMatch[1].trim();
          currentTitle = groupMatch[2].trim();
        }
      }
    } else if (line.toLowerCase().startsWith("group")) {
      const groupMatch = line.match(/group\d*=(.+)/i);
      if (groupMatch) {
        currentGroup = groupMatch[1].trim();
      }
    }
  }

  const categories = Array.from(categoriesSet).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return {
    id: generateId(),
    name: playlistName,
    channels,
    categories,
    lastUpdated: Date.now(),
  };
}

/**
 * Parses XSPF (XML Shareable Playlist Format) format
 * Example:
 * <?xml version="1.0" encoding="UTF-8"?>
 * <playlist>
 *   <trackList>
 *     <track>
 *       <title>Channel 1</title>
 *       <location>http://stream1.url</location>
 *       <image>http://logo.url</image>
 *     </track>
 *   </trackList>
 * </playlist>
 */
export function parseXSPF(
  content: string,
  playlistName: string = "My Playlist",
): Playlist {
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();

  // Simple XML parsing without DOM (works in React Native)
  const trackRegex = /<track>([\s\S]*?)<\/track>/gi;
  let match;

  while ((match = trackRegex.exec(content)) !== null) {
    const trackContent = match[1];

    const titleMatch = trackContent.match(/<title>([^<]*)<\/title>/i);
    const locationMatch = trackContent.match(/<location>([^<]*)<\/location>/i);
    const imageMatch = trackContent.match(/<image>([^<]*)<\/image>/i);
    const creatorMatch = trackContent.match(/<creator>([^<]*)<\/creator>/i);
    const annotationMatch = trackContent.match(
      /<annotation>([^<]*)<\/annotation>/i,
    );

    if (locationMatch) {
      const url = locationMatch[1].trim();
      const { cleanUrl, headers: urlHeaders } = parseUrlHeaders(url);

      let group = creatorMatch ? creatorMatch[1].trim() : "Uncategorized";
      if (annotationMatch && !creatorMatch) {
        group = annotationMatch[1].trim();
      }

      const channel: Channel = {
        id: stableChannelId(cleanUrl),
        name: titleMatch ? titleMatch[1].trim() : "Unknown Channel",
        url: cleanUrl,
        logo: imageMatch ? imageMatch[1].trim() : undefined,
        group: autoGroupChannel(
          titleMatch ? titleMatch[1].trim() : "Unknown Channel",
          group,
        ),
        tvgId: undefined,
        tvgName: undefined,
        quality: undefined,
        drm: undefined,
        headers: Object.keys(urlHeaders).length > 0 ? urlHeaders : undefined,
        isLive: true,
      };
      channels.push(channel);
      categoriesSet.add(channel.group);
    }
  }

  const categories = Array.from(categoriesSet).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return {
    id: generateId(),
    name: playlistName,
    channels,
    categories,
    lastUpdated: Date.now(),
  };
}

/**
 * Detects playlist format and parses accordingly
 */
export function parsePlaylist(
  content: string,
  playlistName: string = "My Playlist",
): Playlist {
  const trimmed = content.trim();

  // Check for M3U/M3U8
  if (trimmed.startsWith("#EXTM3U") || trimmed.includes("#EXTINF:")) {
    return parseM3U(content, playlistName);
  }

  // Check for PLS
  if (
    trimmed.toLowerCase().includes("[playlist]") ||
    trimmed.toLowerCase().includes("numberofentries=")
  ) {
    return parsePLS(content, playlistName);
  }

  // Check for XSPF (XML-based)
  // The XSPF standard uses <trackList> (camelCase) — not <tracklist>.
  if (
    trimmed.includes("<playlist") &&
    (trimmed.includes("<trackList>") || trimmed.includes("<tracklist>"))
  ) {
    return parseXSPF(content, playlistName);
  }

  // Try to detect JSON-based playlists (some IPTV providers use JSON)
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parseJSONArray(parsed, playlistName);
    }
    if (parsed.channels && Array.isArray(parsed.channels)) {
      return parseJSONArray(parsed.channels, playlistName);
    }
  } catch {
    // Not JSON
  }

  throw new Error(
    "Unsupported playlist format. Supported formats: M3U, M3U8, PLS, XSPF, JSON",
  );
}

/**
 * Parses a JSON array of channels
 * Expected format: [{ name, url, logo?, group? }, ...]
 */
function parseJSONArray(
  items: any[],
  playlistName: string = "My Playlist",
): Playlist {
  const channels: Channel[] = [];
  const categoriesSet = new Set<string>();

  for (const item of items) {
    if (!item.url) continue;

    const url = typeof item.url === "string" ? item.url : "";
    const { cleanUrl, headers: urlHeaders } = parseUrlHeaders(url);

    const channel: Channel = {
      id: stableChannelId(cleanUrl),
      name: item.name || item.title || "Unknown Channel",
      url: cleanUrl,
      logo: item.logo || item.image || item.tvgLogo || undefined,
      group: autoGroupChannel(
        item.name || item.title || "Unknown Channel",
        item.group || item.category || item.groupTitle,
      ),
      tvgId: item.tvgId || item.epgId || undefined,
      tvgName: item.tvgName || undefined,
      quality: item.quality || undefined,
      drm: item.drm || undefined,
      headers: Object.keys(urlHeaders).length > 0 ? urlHeaders : undefined,
      isLive: item.isLive !== false,
    };
    channels.push(channel);
    categoriesSet.add(channel.group);
  }

  const categories = Array.from(categoriesSet).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  return {
    id: generateId(),
    name: playlistName,
    channels,
    categories,
    lastUpdated: Date.now(),
  };
}

/**
 * Fetches and parses any playlist format
 */
export async function fetchAndParsePlaylist(
  url: string,
  customName?: string,
): Promise<Playlist> {
  let content: string | null = null;

  // Try native OkHttp fetch first (properly handles User-Agent on Android)
  try {
    const result = await fetchPlaylistNative(url);
    if (result.success) {
      content = result.content;
    }
  } catch {
    // Native fetch unavailable, fall through to JS fetch
  }

  // Fallback: JS fetch
  if (!content) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": PRYSM_USER_AGENT,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Could not fetch playlist. The server may be blocking requests or require specific app authentication.",
      );
    }

    content = await response.text();
  }

  if (!content) {
    throw new Error(
      "Could not fetch playlist. The server may be blocking requests or require specific app authentication.",
    );
  }

  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1]
    .split("?")[0]
    .replace(/\.(m3u8?|pls|xspf|json)$/i, "");
  const playlistName = customName || fileName || "Remote Playlist";

  try {
    const playlist = parsePlaylist(content, playlistName);
    playlist.url = url;
    return playlist;
  } catch (parseError: any) {
    throw new Error(
      `Failed to parse playlist: ${parseError.message || "Unknown parsing error"}`,
    );
  }
}
