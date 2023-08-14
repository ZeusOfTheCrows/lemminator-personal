# Lemminator
A web UI for Lemmy

## Goal
Lemminator wants to make Lemmy a place where even your friends who aren't into tech will feel at home. By creating a welcoming experience for people from all walks of life, Lemminator hopes to help a wide variety of communities come to fruition.

Lemminator aims to:
- Make using Lemmy simple and easy
- Be pleasant to look at
- Cater to the needs of the average internet user

Lemminator will not offer every possible feature or setting. While it may endlessly obsess over tweaking the basics, the [official Lemmy web UI](https://github.com/LemmyNet/lemmy-ui) as well as projects like [Alexandrite](https://alexandrite.app/) are more feature-focused. Power users may prefer them instead - no hard feelings! (Before you go though, give our keyboard navigation for posts and communities a try. It's pretty cool.)

## Using Lemminator

Currently Lemminator covers most essential functionality, but is lacking some advanced features. There is a demo server up at https://lemminator.netlify.app/ if you'd like to follow the development progress.

Lemminator is a generic web frontend meant to be hosted by the owner of your favorite instance. This prevents brand confusion that can arise when the website lives on a different domain name than the instance. You can run Lemminator independently if you want to, but keep in mind that instances may limit your in-browser API access via CORS.


### Keyboard hotkeys

While Lemminator generally caters to regular end users, its keyboard navigation is a fun gimmick for power users. The information below ought to be integrated into the UI at some point.

![Demo](docs/video/keynav.mp4)

#### Navigate between posts

- `j` moves to the next post
- `k` moves to the previous post
- `o` opens the selected post

`j`/`k` should work between pages.

#### Navigate between comments

- `j` moves to the next comment on the same level
- `k` moves to the previous comment on the same level
- `h` moves to the parent comment
- `l` moves to the first child of the current comment

### Developing

The codebase is a standard SvelteKit/Vite website. Run `yarn` to get your dependencies, then `yarn run dev` to get a development server up and running.

### Deploying

#### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://gitlab.com/FrostySpectacles/lemminator)

We have a `netlify.toml` file, which contains the necessary configuration for the production build. The only thing you still need to configure manually is the hostname of the instance you're building for. Under Site configuration > Environment variables, add a new environment variable titled `VITE_INSTANCE_HOSTNAME` with a value such as `lemmy.ml`.

Usage of Netlify is free for low-traffic websites.

#### Deploy as a Docker image
This is a good option if you have a VPS or Kubernetes cluster. During the build, the hostname of your instance is baked into the code. Here's an example that builds for lemmy.world and runs the server on port 3000:

```
docker build -t tmp --build-arg="VITE_INSTANCE_HOSTNAME=lemmy.world" .
docker run -ti -p 3000:3000 --rm tmp 
```

## Contributing
Thank you for your interest in contributing. As being a maintainer can be quite stressful, I'm trying to focus my limited energy on development. Due to this, I might not respond to feature requests or spontaneous feature patches. Hopefully you understand. Feel free to submit bug fixes and bug reports though.

I've licensed the code under AGPL v3.0. You can fork the repo if my judgements aren't in the best interest of the community or if I lack time to continue the project.

## Not yet supported, but planned
- Inbox
- Subscribing/unsubscribing
- Comment permalinks
- Post search
- Better handling for various edge cases (e.g. locked posts)
- A post list layout switcher (big cards vs. dense lists)
- Registration
- 2FA support
- Safety filter settings (currently only SFW content is shown)

## Out of scope
- Moderation tools. The primary focus is building a pleasant experience for the majority of users.