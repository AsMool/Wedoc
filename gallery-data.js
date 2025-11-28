const DAY_IMAGES = [
    {
        src: 'img/photojours/20251031_163052.webp',
        description: 'Chambre vandalisée.',
    },
    {
        src: 'img/photojours/20251031_163459.webp',
        description: 'Cours du bâtiment.',
    },
    {
        src: 'img/photojours/20251031_163738(0).webp',
        description: 'Façade interne de l\'aile droite.',
    },
    {
        src: 'img/photojours/20251031_165036.webp',
        description: 'Page sale et humide d\'un livre en hébreu.',
    },
    {
        src: 'img/photojours/20251031_165325.webp',
        description: 'Mur couvert de lierre.',
    },
    {
        src: 'img/photojours/20251031_165438.webp',
        description: 'Façade interne de l\'aile gauche.',
    },
    {
        src: 'img/photojours/IMG_8116.webp',
        description: 'Chaussure de Petri.',
    },
    {
        src: 'img/photojours/IMG_8117.jpeg',
        description: 'Explorateur interviewé.',
    },
    {
        src: 'img/photojours/nouvelleimagejour1.webp',
        description: 'Escalier délabré sans plafond.',
    },
    {
        src: 'img/photojours/nouvelleimagejour2.webp',
        description: 'L\'aile gauche vue de l\'extérieur.',
    },
    {
        src: 'img/photojours/nouvelleimagejour3.webp',
        description: 'Bâtiment a moitié effondré.',
    },
    {
        src: 'img/photojours/nouvelleimagejour4.webp',
        description: 'Annexe avec une piscine.',
    }
];

const NIGHT_IMAGES = [
    {
        src: 'img/photonuit/169DBAA2-E100-4D23-91EE-991EB90BE0E5_1_105_c.webp',
        description: 'Graffitis, évoquant le Judaisme.',
    },
    {
        src: 'img/photonuit/1AB32A95-DFA8-4B0B-B2BF-E5D9B9402B23_1_105_c.webp',
        description: 'Salle des machines.',
    },
    {
        src: 'img/photonuit/2AF33758-D792-49A5-BEE5-DC67E377A12B_1_105_c.webp',
        description: 'Tuyauterie en sous-sol.',
    },
    {
        src: 'img/photonuit/2D130D95-B8C2-42D5-9EE4-C18C297FB083_1_105_c.webp',
        description: 'Equipement d\'Explorateur.',
    },
    {
        src: 'img/photonuit/4CB53772-856E-4487-A3FB-074F11CC4903_1_105_c.webp',
        description: 'Graffitis en salle.',
    },
    {
        src: 'img/photonuit/50B30557-0B5E-4352-B26F-4D4D6FC5CDBC_1_105_c.webp',
        description: 'Chambre du dernier étage de l\'aile droite.',
    },
    {
        src: 'img/photonuit/54D260A5-36A0-44C5-A414-437D51B5A7D1_1_105_c.webp',
        description: 'Entrée.',
    },
    {
        src: 'img/photonuit/5B3340BF-69AE-43C1-A0F3-FC6C3C43D8E1_1_105_c.webp',
        description: 'Hangar.',
    },
    {
        src: 'img/photonuit/6620355E-8D35-4C1E-965C-B9D5D5E10D49_1_105_c.webp',
        description: 'Masque son identité.',
    },
    {
        src: 'img/photonuit/72A8E73F-EA66-485B-BC32-5B90EAB632C7_1_105_c.webp',
        description: 'Chapelle.',
    },
    {
        src: 'img/photonuit/965D1BEC-D265-4888-88EB-FBD636B89195_1_105_c.webp',
        description: 'Couloir abandonné.',
    },
    {
        src: 'img/photonuit/AA61889A-E1FC-4B78-9925-7104B133DA5A_1_105_c.webp',
        description: 'Autre chambre du dernier étage de l\'aile droite.',
    },
    {
        src: 'img/photonuit/B21E81F6-445B-4CBE-8FCA-89133C33FBD2_1_105_c.webp',
        description: 'Ouverture dans un hangar.',
    },
    {
        src: 'img/photonuit/B25B0532-CC3E-470D-8756-4902EF578C99_1_105_c.webp',
        description: 'Couloirs d\'hôpital.',
    },
    {
        src: 'img/photonuit/B4BA88B5-CF2D-4A5C-9540-D933537B6670_1_105_c.webp',
        description: 'Escalier venant du toit.',
    },
    {
        src: 'img/photonuit/C8C1E233-E5B7-4AC0-A1ED-B2037C733985_1_105_c.webp',
        description: 'Lit d\'hôpital.',
    },
    {
        src: 'img/photonuit/D3207E6B-1256-46F9-BD6C-286E79BBF0C8_1_105_c.webp',
        description: 'Toilettes.',
    },
    {
        src: 'img/photonuit/D884CA4B-D85B-41FB-9CAE-0AA832808AB8_1_105_c.webp',
        description: 'Pharmacie.',
    },
    {
        src: 'img/photonuit/DBB3E2E2-B17D-494B-A844-EACC5AF8C2DA_1_105_c.webp',
        description: 'Grande salle à moitié brûlée.',
    },
    {
        src: 'img/photonuit/DD49D98E-7630-4B5D-8174-98CC90C4C031_1_105_c.webp',
        description: 'Moteur d\'ascenseur.',
    },
    {
        src: 'img/photonuit/E37FEBF2-6E3F-4A9C-B414-1B615917666B_1_105_c.webp',
        description: 'Canalisations d\'hôpital.',
    },
    {
        src: 'img/photonuit/E8FA4D7A-2C75-4405-9211-6C0B2833F66D_1_105_c.webp',
        description: 'Tas de feuilles médicales diverses.',
    },
    {
        src: 'img/photonuit/EFD2AA38-9EA9-481E-BBDC-FEED35D572C3_1_105_c.webp',
        description: 'Sous-sol d\'un bâtiment en rénovation.',
    },
    {
        src: 'img/photonuit/F7D72006-230E-4E3B-8485-D8369153436D_1_105_c.webp',
        description: 'Porteur rose.',
    },
    {
        src: 'img/photonuit/FF21117B-63C8-42BB-A8A3-EAD5F2E4E3F8.webp',
        description: 'Acteur vivant.',
    },
];
