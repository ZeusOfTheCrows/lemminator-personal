export const load = async ({ cookies }) => {
    return {
        jwt: cookies.get('jwt'),
    };
};