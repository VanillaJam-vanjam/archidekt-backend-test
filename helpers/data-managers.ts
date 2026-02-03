import { DECK_IDS } from "../data/deck-ids.ts";
import type { CompiledDeckData } from "../types/types-compiled-deck.ts"
import type { ArchidektApiDataType, CardDataType, CardType } from "../types/types-archidekt-api.ts"

/**
 * Fetches and compiles all decks from the Archidekt API.
 * @returns A promise that resolves to an array of compiled deck objects.
 */
export default async function CompileAllDecks(): Promise<CompiledDeckData[]> {
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
function CompileDeckInfo(data: ArchidektApiDataType) {
    const cardList = data.cards;
    const commanderCard = GetCommanderCard(cardList);
    return {
        name: GetDeckName(data),
        commander: commanderCard ? commanderCard.card.oracleCard.name : "None",
        colors: commanderCard ? GetColorIdentity(commanderCard) : "Colorless",
        cards: GetCardCount(cardList),
        salt: GetSaltScore(cardList),
        links:{
            deckLink: `http://archidekt.com/decks/${data.id}/`,
            imageLink: GetImageLink(data),
        }
    };
}

function GetDeckName(data: ArchidektApiDataType) {
    return data.name;
}

function GetCommanderCard(cards: CardDataType[]) {
    return cards.find((card: { categories: string[]; }) =>
        card?.categories?.some((category: string) => category === "Commander")
    );
}

/**
 * Computes the color identity of the commander card into MTG's format
 */
function GetColorIdentity(commanderCard: CardDataType) {
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

function GetCardCount(cards: CardDataType[]) {
    let cardCount = 0;
    cards.forEach((card: { quantity: number; }) => {
        cardCount += card.quantity;
    });
    return cardCount;
}

function GetSaltScore(cards: CardDataType[]) {
    let totalSalt = 0;
    cards.forEach((card: { card: { oracleCard: { salt: number; }; }; quantity: number; }) => {
        totalSalt += card.card.oracleCard.salt * card.quantity;
    })
    return totalSalt.toFixed(1);
}

function GetImageLink(data: any) {
    return data.featured;
}