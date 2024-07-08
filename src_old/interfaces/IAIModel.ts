// TODO: Document
export type TAIModel = {
    [key: string]: IAIModel;
}

/**
 * Interface for AI model
 * @interface IAIModel
 * @property {string} name - The name of the AI.
 * @property {string} model - The GPT model to use for the AI.
 * @property {string} symbol_to_replace - The symbol to replace in the AI's response.
 * @property {string[]} symbol_replacements - The symbols to replace the symbol_to_replace with.
 * @example {
 *  name: "Prompt_Improver",
 *  model: "gpt-4",
 *  symbol_to_replace: "",
 *  symbol_replacements: [""]
 * }
 */
export interface IAIModel {
    name: string;
    model: string;
    symbol_to_replace: string;
    symbol_replacements: string[];
}