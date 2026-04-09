-- Seed : membre Vincent
-- À exécuter dans le SQL Editor de Supabase après avoir créé les tables

insert into membres (nom, prenom, age) values ('Dupont', 'Vincent', null)
returning id;

-- Remplace <MEMBRE_ID> par l'UUID retourné ci-dessus, puis insère les flux :

-- insert into flux_capital (membre_id, moment, capital_investit, valeur_ptf) values
-- ('<MEMBRE_ID>', 'jan. 25', 1000,  null),
-- ('<MEMBRE_ID>', 'fév. 25', 1200,  1007.23),
-- ('<MEMBRE_ID>', 'mar. 25', 1400,  1136.13),
-- ('<MEMBRE_ID>', 'avr. 25', 1600,  1256.28),
-- ('<MEMBRE_ID>', 'mai. 25', 1800,  1519.23),
-- ('<MEMBRE_ID>', 'jun. 25', 2000,  1812.73),
-- ('<MEMBRE_ID>', 'jul. 25', 2200,  2032.47),
-- ('<MEMBRE_ID>', 'aoû. 25', 2400,  2542.23),
-- ('<MEMBRE_ID>', 'sep. 25', 2600,  2590.39),
-- ('<MEMBRE_ID>', 'oct. 25', 2800,  2949.22),
-- ('<MEMBRE_ID>', 'nov. 25', 3100,  3265.99),
-- ('<MEMBRE_ID>', 'déc. 25', 3300,  3658.28),
-- ('<MEMBRE_ID>', 'jan. 26', 3600,  3856.01),
-- ('<MEMBRE_ID>', 'fév. 26', 3900,  4253.86),
-- ('<MEMBRE_ID>', 'mar. 26', 4200,  4690.87),
-- ('<MEMBRE_ID>', 'avr. 26', 4400,  4756.68),
-- ('<MEMBRE_ID>', 'avr. 26', 4400,  5060.89);

-- Après insertion, appelle POST /api/flux pour chaque ligne via l'interface Saisie,
-- ou utilise le script seed.ts ci-dessous pour automatiser.
