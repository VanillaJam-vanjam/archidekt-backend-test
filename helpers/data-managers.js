import { deckIds } from "../data/deck-ids.js";

/**
 * Fetches and compiles all decks from the Archidekt API.
 * @returns A promise that resolves to an array of compiled deck objects.
 */
async function CompileAllDecks() {
    const allDecks = await Promise.all(
        deckIds.map(async id => {
            const res = await fetch(`http://archidekt.com/api/decks/${id}/`);
            if (!res.ok) throw new Error("Deck not found");
            const data = await res.json();
            const deck = CompileDeckInfo(data);
            console.log("Found deck: " + deck.name);
            return deck;
        })
    );
    return allDecks;
}

export default CompileAllDecks;

/**
 * Compiles deck information from API data
 * @param {*} data The API data
 * @returns A compiled deck object
 */
function CompileDeckInfo(data) {
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

function GetName(data) {
    return data.name;
}

function GetCommanderCard(cards) {
    return cards.find(card =>
        card?.categories?.some(category => category === "Commander")
    );
}

/**
 * Computes the color identity of the commander card into MTG's format
 */
function GetColorIdentity(commanderCard) {
    let colorIdentity = "";
    commanderCard.card.oracleCard.colorIdentity.forEach(color => {
        colorIdentity += GetColorLetter(color);
    });

    if (colorIdentity === "")
        colorIdentity = "Colorless";

    return colorIdentity;

    function GetColorLetter(colorName) {
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

function GetCardCount(cards) {
    let cardCount = 0;
    cards.forEach(card => {
        cardCount += card.quantity;
    });
    return cardCount;
}

function GetSaltScore(cards) {
    let totalSalt = 0;
    cards.forEach(card => {
        totalSalt += card.card.oracleCard.salt * card.quantity;
    })
    return totalSalt.toFixed(1);
}

function GetImageLink(data) {
    return data.featured;
}