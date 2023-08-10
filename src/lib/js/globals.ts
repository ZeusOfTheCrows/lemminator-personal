import type { GetSiteResponse, Person } from "lemmy-js-client";
import { writable, type Readable, type Writable, derived } from "svelte/store";
import { getClient } from "./client";
import Cookies from 'js-cookie';

export const keynav: Writable<{
    mode: 'normal';
}> = writable({
    mode: 'normal',
});


export type Theme = 'dark' | 'light';
function getThemePreference(): Theme {
    const cookieValue = Cookies.get('activeTheme');
    return (cookieValue === 'dark') ? 'dark' : 'light';
}
export const theme: Writable<Theme> = writable(getThemePreference());
theme.subscribe((newValue) => {
    Cookies.set('activeTheme', newValue, { expires: 365 * 5 });
});

// Only layouts may transition out of authenticating. Every other transition is fair game.
export type Unauthenticated = {
    state: 'unauthenticated',
    jwt: undefined,
}
export type Authenticating = {
    state: 'authenticating',
    jwt: undefined,
    callback?: () => void,
}
export type Authenticated = {
    state: 'authenticated',
    jwt: string,
}
export type AuthenticationState = Unauthenticated | Authenticating | Authenticated;
export const session: Writable<AuthenticationState> = writable((() => {
    if (Cookies.get('jwt')) {
        return {
            state: 'authenticated',
            jwt: Cookies.get('jwt') ?? '',
        };
    }
    return { state: 'unauthenticated' };
})());
session.subscribe((newValue) => {
    if (newValue.state === 'authenticated') {
        Cookies.set('jwt', newValue.jwt, { expires: 30 });
    } else {
        Cookies.remove('jwt');
    }
})

export const cachedCalls: Readable<{
    siteResponse: Promise<GetSiteResponse>,
}> = derived(session, ($session) => {
    const client = getClient();
    return {
        siteResponse: client.getSite($session.jwt),
    };
});

export function getLocalPerson(siteResponse: GetSiteResponse): Person | null {
    return siteResponse.my_user?.local_user_view.person ?? null;
}