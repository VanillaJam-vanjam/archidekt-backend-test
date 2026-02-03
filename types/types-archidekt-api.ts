type Owner = {
    is: number,
    username: string,
    avatar: string,
    frame: string | null,
    ckAffiliate: string,
    tcgAffiliate: string,
    referrerEnum: string | null,
}

type DeckCategory = {
    id: number,
    name: string,
    isPremier: boolean,
    includedInDeck: boolean,
    includedInPrice: boolean
}

type EditionType = {
    editioncode: string,
    editionname: string,
    editiondate: string,
    editiontype: string,
    mtgoCode: string,
}

/**
 * If the card has another face on the flip side
 */
type CardFaceType = {
    colors: string[],
    flavor: string,
    manaCost: string,
    name: string,
    power: string,
    subTypes: string[],
    superTypes: string[],
    text: string,
    toughness: string,
    types: string[],
    loyalty: string | null,
}

type LegalitiesType = {
    alchemy: string,
    legacy: string,
    oldschool: string,
    modern: string,
    vintage: string,
    oathbreaker: string,
    "1v1": string,
    historicbrawl: string,
    premodern: string,
    historic: string,
    commander: string,
    paupercommander: string,
    gladiator: string,
    explorer: string,
    brawl: string,
    penny: string,
    pioneer: string,
    duel: string,
    pauper: string,
    standard: string,
    future: string,
    predh: string,
    timeless: string,
    canlander: string,
}

/**
 * What's in the actual physical card
 */
export type OracleCardType = {
    id: number,
    cmc: number,
    colorIdentity: string[],
    colors: string[],
    edhrecRank: number,
    faces: CardFaceType[],
    layout: string,
    uid: string,
    legalities: LegalitiesType,
    manaCost: string,
    manaProduction: {
        W: number | null,
        U: number | null,
        B: number | null,
        R: number | null,
        G: number | null,
        C: number | null,
    }
    name: string,
    power: string,
    salt: number,
    subtypes: string[],
    superTypes: string[],
    keywords: string[],
    text: string,
    tokens: string[],
    toughness: string,
    types: string[],
    loyalty: string | null,
    canlanderPoints: string | null,
    isPDHCommander: boolean,
    defaultCategory: string,
    gameChanger: boolean,
    extraTurns: boolean,
    tutor: boolean,
    massLandDenial: boolean,
    twoCardComboSingelton: boolean, //Yes. There is a typo in the api
    twoCardComboIds: string[],
    atomicCombos: string[],
    potentialCombos: string[],
    lang: string,
}

type PricesType = {
    ck: number,
    ckFoil: number,
    cm: number,
    cmFoil: number,
    mtgo: number,
    mtgoFoil: number,
    tcg: number,
    tcgFoil: number,
    scg: number,
    scgFoil: number,
    mp: number,
    mpFoil: number,
    tecgLand: number,
    tcgLandFoil: number,
}

/**
 * Card's release and edition data
 */
export type CardType = {
    id: number,
    artist: string,
    tcgProductId: number,
    ckFoilId: number,
    ckNormalId: number,
    cmEd: string,
    scgSku: string,
    scgFoilSku: string,
    collectorNumber: string,
    multiverseid: number,
    mtgoFoilId: number,
    mtgoNormalId: number,
    uid: string,
    displayName: string | null,
    releasedAt: string,
    contentWarning: boolean,
    edition: EditionType,
    flavor: string,
    games: string[]
    options: string[],
    scryfallImageHash: string,
    oracleCard: OracleCardType,
    owned: number,
    pinnedStatus: number,
    prices: PricesType,
    rarity: string,
    globalCategories: string[]
}

/**
 * Data of a card in the deck
 */
export type CardDataType = {
    id: number,
    categories: string[],
    companion: boolean,
    flippedDefault: boolean,
    label: string,
    modifier: string,
    quantity: number,
    customCmc: number | null,
    removedCategories: string | null,
    createdAt: string,
    updatedAt: string | null,
    deletedAt: string | null,
    notes: string[] | null,
    card: CardType,
}

export type ArchidektApiDataType = {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string,
    deckFormat: number,
    edhBracket: number,
    game: string | null,
    description: string,
    viewCount: number,
    featured: string,
    customFeatured: string,
    private: boolean,
    unlisted: boolean,
    theorycrafted: boolean,
    points: number,
    userInput: number,
    owner: Owner,
    commentRoot: number,
    editors: string | null,
    parentFolder: number,
    bookmarked: boolean,
    categories: DeckCategory[],
    deckTags: string[],
    playgroupDeckUrl: string,
    cardPackage: number | null,
    cards: CardDataType[],
    customCards: CardDataType[]
}