# Lemminator
A web UI for Lemmy

## Goal
Lemminator wants to make Lemmy a place where even your friends who aren't into tech will feel at home. By creating a welcoming experience for people from all walks of life, Lemminator hopes to help a wide variety of communities come to fruition.

Lemminator aims to:
- Make using Lemmy simple and easy
- Be pleasant to look at
- Cater to the needs of the average internet user

Lemminator will not offer every possible feature or setting. While it may endlessly obsess over tweaking the basics, the [official Lemmy web UI](https://github.com/LemmyNet/lemmy-ui) as well as projects like [Alexandrite](https://alexandrite.app/) are more feature-focused. Power users may prefer them instead - no hard feelings! (Before you go though, give our keyboard navigation for posts and communities. It's pretty cool.)

## Using Lemminator

Right now, Lemminator isn't ready to be a daily driver. There is a demo server up at https://lemminator.netlify.app/ if you'd like to follow the progress.

Lemminator is a generic web frontend meant to be hosted by the owner of your favorite instance. This prevents brand confusion that can arise when the website lives on a different domain name than the instance. You can run Lemminator independently if you want to, but keep in mind that instances may limit your in-browser API access via CORS.

### Developing

The codebase is a standard SvelteKit/Vite website. Run `yarn` to get your dependencies, then `yarn run dev` to get a development server up and running.

### Deploying
Lemminator should be able to deploy to Netlify out of the box with no configuration. For other deployment scenarios, refer to [SvelteKit's documentation](https://kit.svelte.dev/docs/adapter-auto).

## Contributing
Thank you for your interest in contributing. As being a maintainer can be quite stressful, I'm trying to focus my limited energy on development. Due to this, I might not respond to feature requests or spontaneous feature patches. Hopefully you understand. Feel free to submit bug fixes and bug reports though.

I've licensed the code under AGPL v3.0 so that you can fork the repo if my judgements aren't in the best interest of the community or if I lack time to continue the project.