/**
 * Interface for AI model
 * @interface IAIModel
 * @property {string} model - The model to use for the AI.
 * @property {string} symbol_to_replace - The symbol to replace in the AI's response.
 * @property {string[]} symbol_replacements - The symbols to replace the symbol_to_replace with.
 */
export interface IAIModel {
    model: string;
    symbol_to_replace: string;
    symbol_replacements: string[];
}