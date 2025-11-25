const DAY_IMAGES = [
    {
        src: 'img/photojours/20251031_163052.webp',
        description: 'Façade d\'usine abandonnée envahie par la végétation.',
        tags: ['urbex', 'graffiti', 'abandonné'],
    },
    {
        src: 'img/photojours/20251031_163459.webp',
        description: 'Ruine circulaire de béton, tags et débris sous branches dénudées.',
        tags: ['urbex', 'ruine', 'intérieur'],
    },
    {
        src: 'img/photojours/20251031_163738(0).webp',
        description: 'Béton oublié, reconquis par la nature sous un ciel menaçant.',
        tags: ['urbex', 'couloir', 'sombre'],
    },
    {
        src: 'img/photojours/20251031_165036.webp',
        description: 'Main gantée révèle Jérusalem: document sacré, altéré par l\'oubli.',
        tags: ['urbex', 'fenêtre', 'cassée'],
    },
    {
        src: 'img/photojours/20251031_165325.webp',
        description: 'Lierre dévore la ruine. La nature reconquiert, silencieusement.',
        tags: ['urbex', 'escalier', 'délabré'],
    },
    {
        src: 'img/photojours/20251031_165438.webp',
        description: 'Immeubles fantômes, mangés par la végétation sous un ciel mélancolique.',
        tags: ['urbex', 'pièce', 'vide'],
    },
    {
        src: 'img/photojours/IMG_8116.webp',
        description: 'Mousse luxuriante sur basket oubliée, la nature reprend ses droits.',
        tags: ['urbex', 'mur', 'peinture'],
    },
    {
        src: 'img/photojours/IMG_8117.jpeg',
        description: 'Silhouette masquée. Ruines bétonnées, l\'oubli sous un tapis de feuilles.',
        tags: ['urbex', 'débris', 'entrepôt'],
    }
];

const NIGHT_IMAGES = [
    {
        src: 'img/photonuit/169DBAA2-E100-4D23-91EE-991EB90BE0E5_1_105_c.webp',
        description: 'Graffitis, peinture écaillée : l\'œil ardent de l\'abandon veille.',
        tags: ['urbex', 'nuit', 'église'],
    },
    {
        src: 'img/photonuit/1AB32A95-DFA8-4B0B-B2BF-E5D9B9402B23_1_105_c.webp',
        description: 'Décrépitude souterraine : rouille, tuyaux et l\'écho d\'un monde oublié.',
        tags: ['urbex', 'nuit', 'hôpital'],
    },
    {
        src: 'img/photonuit/1EA9D4B7-B150-4030-81EF-613FA0015EA2_1_105_c.webp',
        description: 'Permis de construire souillé, chantier interdit. La nature reconquiert l\'oubli.',
        tags: ['urbex', 'nuit', 'usine'],
    },
    {
        src: 'img/photonuit/2AF33758-D792-49A5-BEE5-DC67E377A12B_1_105_c.webp',
        description: 'Sous-sol décrépit: tuyaux, chaudière muette, loubli règne en maître.',
        tags: ['urbex', 'nuit', 'manoir'],
    },
    {
        src: 'img/photonuit/2D130D95-B8C2-42D5-9EE4-C18C297FB083_1_105_c.webp',
        description: 'Masque à gaz. Veilleur crépusculaire sur sentier boisé oublié.',
        tags: ['urbex', 'nuit', 'entrepôt'],
    },
    {
        src: 'img/photonuit/4CB53772-856E-4487-A3FB-074F11CC4903_1_105_c.webp',
        description: 'Lart urbain vibrant envahit la décrépitude dun lieu oublié.',
        tags: ['urbex', 'nuit', 'sanatorium'],
    },
    {
        src: 'img/photonuit/50B30557-0B5E-4352-B26F-4D4D6FC5CDBC_1_105_c.webp',
        description: 'Nuit. Ruine envahie par la végétation luxuriante, débris calcinés, fenêtre sombre.',
        tags: ['urbex', 'nuit', 'théâtre'],
    },
    {
        src: 'img/photonuit/54D260A5-36A0-44C5-A414-437D51B5A7D1_1_105_c.webp',
        description: 'Quais de gare déserts sous la lune.',
        tags: ['urbex', 'nuit', 'gare'],
    },
    {
        src: 'img/photonuit/5B3340BF-69AE-43C1-A0F3-FC6C3C43D8E1_1_105_c.webp',
        description: 'Bassin de piscine vide et craquelé.',
        tags: ['urbex', 'nuit', 'piscine'],
    },
    {
        src: 'img/photonuit/6620355E-8D35-4C1E-965C-B9D5D5E10D49_1_105_c.webp',
        description: 'Un crâne lumineux sous la capuche hante ce sentier crépusculaire.',
        tags: ['urbex', 'nuit', 'château'],
    },
    {
        src: 'img/photonuit/72A8E73F-EA66-485B-BC32-5B90EAB632C7_1_105_c.webp',
        description: 'Portes s\'ouvrent sur pénombre: ogive bleue, graffitis, secrets oubliés.',
        tags: ['urbex', 'nuit', 'école'],
    },
    {
        src: 'img/photonuit/965D1BEC-D265-4888-88EB-FBD636B89195_1_105_c.webp',
        description: 'Couloir abandonné, graffiti, nature envahissante sous lumière spectrale.',
        tags: ['urbex', 'nuit', 'parc'],
    },
    {
        src: 'img/photonuit/AA61889A-E1FC-4B78-9925-7104B133DA5A_1_105_c.webp',
        description: 'Charpente éventrée, lierre obscur. La nature murmure dans l\'abandon.',
        tags: ['urbex', 'nuit', 'centrale'],
    },
    {
        src: 'img/photonuit/B21E81F6-445B-4CBE-8FCA-89133C33FBD2_1_105_c.webp',
        description: 'L\'art clandestin et le masque hantent l\'ombre d\'un passage urbex.',
        tags: ['urbex', 'nuit', 'militaire'],
    },
    {
        src: 'img/photonuit/B25B0532-CC3E-470D-8756-4902EF578C99_1_105_c.webp',
        description: 'Couloirs sombres, portes béantes. Loubli profond dun lieu figé.',
        tags: ['urbex', 'nuit', 'mine'],
    },
    {
        src: 'img/photonuit/B4BA88B5-CF2D-4A5C-9540-D933537B6670_1_105_c.webp',
        description: 'Descente sombre, béton, graffitis, la nature envahit l\'oubli.',
        tags: ['urbex', 'nuit', 'village'],
    },
    {
        src: 'img/photonuit/C8C1E233-E5B7-4AC0-A1ED-B2037C733985_1_105_c.webp',
        description: 'Lit d\'hôpital abandonné, murs écaillés, tuyaux rouillés. Silence oppressant.',
        tags: ['urbex', 'nuit', 'bunker'],
    },
    {
        src: 'img/photonuit/D3207E6B-1256-46F9-BD6C-286E79BBF0C8_1_105_c.webp',
        description: 'Plafond béant, graffitis hurlants, toilette solitaire. Écho d\'un temps révolu.',
        tags: ['urbex', 'nuit', 'ferme'],
    },
    {
        src: 'img/photonuit/D884CA4B-D85B-41FB-9CAE-0AA832808AB8_1_105_c.webp',
        description: 'Plafond éventré, graffitis, rayonnages. Silence lourd dun passé oublié.',
        tags: ['urbex', 'nuit', 'centre commercial'],
    },
    {
        src: 'img/photonuit/DBB3E2E2-B17D-494B-A844-EACC5AF8C2DA_1_105_c.webp',
        description: 'Squelette de béton calciné, où le silence règne sur l\'oubli.',
        tags: ['urbex', 'nuit', 'navire'],
    },
    {
        src: 'img/photonuit/DD49D98E-7630-4B5D-8174-98CC90C4C031_1_105_c.webp',
        description: 'Moteur dascenseur oublié, son silence raconte labandon.',
        tags: ['urbex', 'nuit', 'observatoire'],
    },
    {
        src: 'img/photonuit/E37FEBF2-6E3F-4A9C-B414-1B615917666B_1_105_c.webp',
        description: 'Canalisations rouillées et complexes, murmures dune vie industrielle oubliée.',
        tags: ['urbex', 'nuit', 'prison'],
    },
    {
        src: 'img/photonuit/E8FA4D7A-2C75-4405-9211-6C0B2833F66D_1_105_c.webp',
        description: 'Papiers jaunes et registres rouges, vestiges dune vie figée.',
        tags: ['urbex', 'nuit', 'bibliothèque'],
    },
    {
        src: 'img/photonuit/EFD2AA38-9EA9-481E-BBDC-FEED35D572C3_1_105_c.webp',
        description: 'Vestiges sombres: béton, débris, bâches. Une lumière sonde loubli.',
        tags: ['urbex', 'nuit', 'métro'],
    },
    {
        src: 'img/photonuit/F7D72006-230E-4E3B-8485-D8369153436D_1_105_c.webp',
        description: 'Lueur faible sur porteur rose, vestige d\'enfance oublié.',
        tags: ['urbex', 'nuit', 'avion'],
    },
    {
        src: 'img/photonuit/FF21117B-63C8-42BB-A8A3-EAD5F2E4E3F8.webp',
        description: 'Silhouette énigmatique, tête dégoulinante sur fond de ruines rouges.',
        tags: ['urbex', 'nuit', 'phare'],
    },
];
