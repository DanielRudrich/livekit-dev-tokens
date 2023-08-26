# LiveKit Dev-Server Token Generator

Ever lost time creating a bunch of tokens for a local [LiveKit](https://livekit.io/) development server (`livekit-server --dev`)?

This simple web app provides a handy UI to create these dev tokens for you:
- 🪪 specify the user's `identity` and what `room` to join
- ☑️ select permissions
- 📋 copy generated token to clipboard
- 😎 **Store setting in the local storage to reuse later!**

Everything happens client-side! No analytics, no telemetry, nothing stored on the server.

Checkout https://livekit-dev-tokens.vercel.app

**Things I want to add[^1]:**
- responsive layout
- edit stored settings
- export/import stored settings
- maybe get rid of `livekit-server-sdk` but might be premature optimization...

Please feel free to create issues if you encounter any bugs!


[^1]: but won't promise to do :D


## Build and run locally
- clone repository
- `npm install`
- `npm run dev`
