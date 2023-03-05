/**
 * **ASYNC** Checks if the given data is truthy. https://developer.mozilla.org/en-US/docs/Glossary/Truthy  
 * If an object, array, set, or map contains ANY truthy values, it is truthy.  
 * The value 0 is truthy.  
 * @param data The data, object or array to check.
 * @param zero Optional false - if this parameter === false, then 0 is also considered falsy.
 * @param obj Optional - if this parameter === true, then the function will only allow objects where all values are truthy.
 * @returns true if TRUTHY and false if FALSY.
 */
export const isTruthyAsync = async (data: any, zero?: boolean, obj?: boolean): Promise<boolean> => {
    // Checking for falsy objects. https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if (data && Object.getOwnPropertyNames(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) return false;

    // Checking the individual elements of an object.
    if (data && Object.getOwnPropertyNames(data).length !== 0 && Object.getPrototypeOf(data) === Object.prototype) {

        if (obj === true) { // If the obj parameter is true, then only allow objects where ALL values are truthy.
            for (const [key, value] of Object.entries(data)) {
                if (!await isTruthyAsync(value, zero, obj)) return false;
            }
        }
        
        return Object.values(data).some(val => isTruthyAsync(val, zero));
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return false;

        for (const foo of data) {
            if (await isTruthyAsync(foo, zero)) return true;
        }
        // 'data' is an array but all elements are falsy.
        return false;
    }

    if (typeof(data) === 'string' && data.length === 0) return false;

    if (typeof(data) === 'undefined' || data === null) return false;

    if (data === 0) {
        if (zero === false) return false; // If the zero parameter is false, then the value 0 is falsy.
          
        return true;
    }

    if (!data) return false;

    // For checking Sets and Maps.
    if (typeof data === 'object') {

        try {
            for (const [key, value] of data) { // Checking Maps
                if (await isTruthyAsync(value, zero)) {
                    return true;
                }
            }
        } catch (e: any) {
            if (e.toString().includes("not iterable")) return true;
            for (const item of data) { // Checking Sets
                if (await isTruthyAsync(item, zero)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    if (obj === true) {
        return Object.values(data).some(val => isTruthyAsync(val, zero));
    }

    return true;
};

/**
 * **SYNC** Checks if the given data is truthy. https://developer.mozilla.org/en-US/docs/Glossary/Truthy  
 * If an object, array, set, or map contains ANY truthy values, it is truthy.  
 * The value 0 is truthy.  
 * @param data The data, object or array to check.
 * @param zero Optional false - if this parameter === false, then 0 is also considered falsy.
 * @param obj Optional - if this parameter === true, then the function will only allow objects where all values are truthy.
 * @returns true if TRUTHY and false if FALSY.
 */
export const isTruthy = (data: any, zero?: boolean, obj?: boolean): boolean => {
    // Checking for falsy objects. https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if (data && Object.getOwnPropertyNames(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) return false;

    // Checking the individual elements of an object.
    if (data && Object.getOwnPropertyNames(data).length !== 0 && Object.getPrototypeOf(data) === Object.prototype) {

        if (obj === true) { // If the obj parameter is true, then only allow objects where ALL values are truthy.
            for (const [key, value] of Object.entries(data)) {
                if (!isTruthy(value, zero, obj)) return false;
            }
        }
        
        return Object.values(data).some(val => isTruthy(val, zero));
    }

    if (Array.isArray(data)) {
        if (data.length === 0) return false;

        for (const foo of data) {
            if (isTruthy(foo, zero)) return true;
        }
        // 'data' is an array but all elements are falsy.
        return false;
    }

    if (typeof(data) === 'string' && data.length === 0) return false;

    if (typeof(data) === 'undefined' || data === null) return false;

    if (data === 0) {
        if (zero === false) return false; // If the zero parameter is false, then the value 0 is falsy.
        return true;
    }

    if (!data) return false;

    // For checking Sets and Maps.
    if (typeof data === 'object') {

        try {
            for (const [key, value] of data) { // Checking Maps
                if (isTruthy(value, zero)) {
                    return true;
                }
            }
        } catch (e: any) {
            if (e.toString().includes("not iterable")) return true;
            for (const item of data) { // Checking Sets
                if (isTruthy(item, zero)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    if (obj === true) {
        return Object.values(data).some(val => isTruthy(val, zero));
    }

    return true;
};