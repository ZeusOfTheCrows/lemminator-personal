import { writable, type Writable } from "svelte/store";

export const keynav: Writable<{
    mode: 'normal';
}> = writable({
    mode: 'normal',
});