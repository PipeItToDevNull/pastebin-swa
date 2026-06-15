// Centralized helper for constructing same-origin API routes used by fetch calls.
export function apiUrl(pathname) {
    return `/api${pathname}`;
}