export type CompiledDeckData = {
    name: string;
    commander: string;
    colors: string;
    cards: number;
    salt: string;
    links: {
        deckLink: string;
        imageLink: string;
    };
}