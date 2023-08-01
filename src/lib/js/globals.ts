import type { GetSiteResponse } from "lemmy-js-client";
import { readable, writable, type Readable, type Writable } from "svelte/store";
import { getClient } from "./client";
import Cookies from 'js-cookie';

export const keynav: Writable<{
    mode: 'normal';
}> = writable({
    mode: 'normal',
});

const client = getClient();

export const cachedCalls: Readable<{
    siteResponse: Promise<GetSiteResponse>,
}> = readable({
    siteResponse: client.getSite(),
});

export type Theme = 'dark' | 'light';
function getThemePreference(): Theme {
    const cookieValue = Cookies.get('activeTheme');
    return (cookieValue === 'dark') ? 'dark' : 'light';
}
export const theme: Writable<Theme> = writable(getThemePreference());
theme.subscribe((newValue) => {
    Cookies.set('activeTheme', newValue);
});

// The root layout should get the last Y scroll position from the snapshot and
// store it here. When any crucial promises like post lists have been resolved,
// the page can restore the original scroll position. Only use this in places
// where we'd otherwise get incorrect scroll positions, e.g. when using shimmers.
// This variable should not be written from anywhere except the root layout.
export const restoredScrollY: Writable<number | null> = writable(null);