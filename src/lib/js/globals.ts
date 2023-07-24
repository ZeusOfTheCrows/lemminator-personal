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
})