# Supabase Generate Type

1. npx supabase login (with access token)
2. npx supabase gen types typescript --project-id pryblxisvpcpqompdwvj --schema public > src/lib/types/supabase.ts

# amount types

Tous les montants sont stockés et calculés en float4 pour optimiser les performances. Néanmoins, dans le cas où l’application devrait un jour gérer des paiements, il faudra s’assurer que les sommes à payer sont stockées sous forme numérique pour avoir la précision nécessaires. Et éventuellement, si les sommes payées sont calculés sur la base des données stockées, il faudra s’assurer que le niveau de précision des float4 est suffisant au cas par cas.

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Managing scenarios

Les tables qui peuvent être scénarisées incluent trois colonnes supplémentaires : Une colonne scenario_id qui référence un scenario, une colonne is_deleted (boolean avec une valeur false par défaut) et une colonne générée scenario_conflict qui reprend la valeur de la colonne scenario_id mais qui transforme null en 0 pour permetre le on_conflict. Le on_conflict est gérée en front avec un on_conflict sur les deux colonnes : id ou uuid de la table scenarisée, et scenario_conflict, par exemple 'uuid, scenario_conflict' lors du upsert.
