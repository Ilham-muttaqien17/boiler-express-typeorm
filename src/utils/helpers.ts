export type AnyType = any;

/**
 * Uppercase first char
 * @param val
 * @returns string
 */
export const ucFirst = (val: string): string => {
  return val.charAt(0).toUpperCase() + val.substring(1).toLowerCase();
};

/**
 * Parse to array
 * @param val - any
 * @returns Array
 */
export const toArray = <T extends AnyType = AnyType>(val: any, isAssign: boolean = false): T[] => {
  return Array.isArray(val) ? val : isAssign ? [val] : [];
};

/**
 * Remove properties from object
 * @param source - Source data in object
 * @param keys - Array of keys wants to delete
 * @returns Object
 */
export function omit<T extends Record<string, any>>(source: Record<string, any>, keys: (keyof T)[]) {
  return Object.keys(source).reduce((prev: Record<string, any>, curr) => {
    if (keys.indexOf(curr) === -1) {
      prev[curr] = source[curr];
    }

    return prev;
  }, {}) as T;
}

/**
 * Pick specific properties from object
 * @param source - Source data in object
 * @param key - Array of keys wants to delete
 * @returns Object
 */
export function pick<T extends Record<string, any>>(source: Record<string, any>, keys: (keyof T)[]) {
  return Object.keys(source).reduce((prev: Record<string, any>, curr) => {
    if (keys.indexOf(curr) !== -1) {
      prev[curr] = source[curr];
    }

    return prev;
  }, {}) as T;
}

/**
 * Create url parameters
 * https://stackoverflow.com/questions/56173848/want-to-convert-a-nested-object-to-query-parameter-for-attaching-to-url
 * @param {object} data Data to create url query
 * @returns String
 */
export function createUrlParams(data: Record<string, any>): string {
  const replaceKey = (str: string) => (str === '__proto__' || str === 'constructor' ? '_proto' : str);
  const getPairs = (obj: Record<string, any>, keys: any[] = []) => {
    return Object.entries(obj).reduce((pairs: any[], [key, value]: any[]) => {
      if (typeof value === 'object') {
        pairs.push(...getPairs(value, [...keys, replaceKey(key)]));
      } else {
        pairs.push([[...keys, replaceKey(key)], value]);
      }
      return pairs;
    }, []);
  };

  const mapped = getPairs(data).map(([[key, ...keysRest], value]: any[]) => {
    return `${replaceKey(key)}${keysRest.map((k: string) => `[${replaceKey(k)}]`).join('')}=${value ?? ''}`;
  });

  return mapped.filter((v) => v.split('=')[1] !== '').join('&');
}
