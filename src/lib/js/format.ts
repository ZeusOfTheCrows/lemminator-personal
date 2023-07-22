export function formatApproxInteger(input: number): string {
    const sign = Math.sign(input) ? '' : '-';
    const absInput = Math.abs(input);
    if (absInput < 1_000) return `${sign}${input.toString()}`;
    if (input <= -1_000_000) {
        const millionsChunk = Math.ceil(input / 1_000_000);
        const prefix = input == -1_000_000 ? '' : '< ';
        return `${prefix}${millionsChunk.toString()}m`;
    }
    if (input <= -1_000) {
        const thousandsChunk = Math.ceil(input / 1_000);
        const prefix = input == -1_000 ? '' : '< ';
        return `${prefix}${thousandsChunk.toString()}k`;
    }
    if (input < 1_000_000) {
        const thousandsChunk = Math.floor(input / 1_000);
        const prefix = (thousandsChunk * 1_000) == input && sign ? '< ' : '';
        const suffix = (thousandsChunk * 1_000) == input ? '' : '+';
        return `${prefix}${thousandsChunk.toString()}k${suffix}`;
    }
    const millionsChunk = Math.floor(input / 1_000_000);
    const suffix = input == 1_000_000 ? '' : '+';
    return `${millionsChunk.toString()}m${suffix}`;
}