import { formatDistanceToNow, format } from "date-fns";

/**
 * Format a date as a relative time (e.g., "3 days ago")
 */
export const formatRelativeDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

/**
 * Format a date in a specific format
 */
export const formatDate = (date: Date | string | undefined, formatStr: string = 'MMM d, yyyy'): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, formatStr);
};

/**
 * Format video duration from seconds to MM:SS format
 */
export const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format number with commas (e.g., 1000 -> 1,000)
 */
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return '0';
  return num.toLocaleString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get CSS classes for trend direction
 */
export const getTrendDirectionClass = (direction: string | undefined): string => {
  if (direction === 'up') return 'text-success';
  if (direction === 'down') return 'text-error';
  return '';
};

/**
 * Format trend percentage with + or - sign
 */
export const formatTrendPercentage = (percentage: number | undefined): string => {
  if (percentage === undefined) return '0%';
  const prefix = percentage >= 0 ? '+' : '';
  return `${prefix}${percentage}%`;
};

/**
 * Generate a random color hex code
 */
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Generate a placeholder image URL
 */
export const getPlaceholderImage = (seed: string = 'placeholder'): string => {
  return `https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80`;
};

/**
 * Convert camelCase to Title Case
 */
export const camelToTitleCase = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Get file extension from a URL or path
 */
export const getFileExtension = (path: string): string => {
  return path.split('.').pop() || '';
};
