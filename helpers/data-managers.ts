import { DECK_IDS } from "../data/deck-ids.ts";

type DeckData = {
    name: any;
    commander: any;
    colors: string;
    cards: number;
    salt: string;
    links: {
        deckLink: string;
        imageLink: any;
    };
}

/**
 * Fetches and compiles all decks from the Archidekt API.
 * @returns A promise that resolves to an array of compiled deck objects.
 */
export default async function CompileAllDecks(): Promise<DeckData[]> {
    const allDecks = await Promise.all(
        DECK_IDS.map(async id => {
            const res = await fetch(`http://archidekt.com/api/decks/${id}/`);
            if (!res.ok) throw new Error("Deck not found");
            const data = await res.json();
            const deck = CompileDeckInfo(data);
            return deck;
        })
    );
    return allDecks;
}

/**
 * Compiles deck information from API data
 * @param {*} data The API data
 * @returns A compiled deck object
 */
function CompileDeckInfo(data: any) {
    const cardList = data.cards;
    const commanderCard = GetCommanderCard(cardList);
    return {
        name: GetName(data),
        commander: commanderCard ? commanderCard.card.oracleCard.name : "None",
        colors: GetColorIdentity(commanderCard),
        cards: GetCardCount(cardList),
        salt: GetSaltScore(cardList),
        links:{
            deckLink: `http://archidekt.com/decks/${data.id}/`,
            imageLink: GetImageLink(data),
        }
    };
}

function GetName(data: any) {
    return data.name;
}

function GetCommanderCard(cards: any) {
    return cards.find((card: { categories: string[]; }) =>
        card?.categories?.some((category: string) => category === "Commander")
    );
}

/**
 * Computes the color identity of the commander card into MTG's format
 */
function GetColorIdentity(commanderCard: any) {
    let colorIdentity = "";
    commanderCard.card.oracleCard.colorIdentity.forEach((color: string) => {
        colorIdentity += GetColorLetter(color);
    });

    if (colorIdentity === "")
        colorIdentity = "Colorless";

    return colorIdentity;

    function GetColorLetter(colorName: string) {
        switch (colorName) {
            case "White":
                return "W";
            case "Blue":
                return "U";
            case "Black":
                return "B";
            case "Red":
                return "R";
            case "Green":
                return "G";
        }
    };
}

function GetCardCount(cards: any) {
    let cardCount = 0;
    cards.forEach((card: { quantity: number; }) => {
        cardCount += card.quantity;
    });
    return cardCount;
}

function GetSaltScore(cards: any) {
    let totalSalt = 0;
    cards.forEach((card: { card: { oracleCard: { salt: number; }; }; quantity: number; }) => {
        totalSalt += card.card.oracleCard.salt * card.quantity;
    })
    return totalSalt.toFixed(1);
}

function GetImageLink(data: any) {
    return data.featured;
}