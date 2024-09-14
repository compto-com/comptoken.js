
/**
 * @param {BigInt} int 
 * @returns {number[]}
 */
export function bigintAsU64ToBytes(int) {
    let arr = new Array(8);
    for (let i = 0; int > 0n; ++i) {
        arr[i] = Number(int & 255n);
        int >>= 8n;
    }
    return arr;
}

/**
 * @param {number} num
 * @returns {number[]}
 */
export function numAsU16ToLEBytes(num) {
    let buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(num);
    return Array.from({ length: 2 }, (v, i) => buffer.readUint8(i));
}

/**
 * @template T
 * @param {T | null | undefined} val
 * @returns {T | null}
 */
export function toOption(val) {
    if (val === undefined || typeof val === "undefined") {
        return null;
    }
    return val;
}

/**
 * @template T
 * @param {T | null} opt_val
 * @param {() => T} fn
 * @returns {T} opt_val if it is not null or result of calling fn
 */
export function getOptionOr(opt_val, fn) {
    if (opt_val === null) {
        return fn();
    }
    return opt_val;
}
/**
 * @param {number} start
 * @param {number} end
 * @yield {number}
 */
function* range(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}
/**
 * @template T
 * @param {T[]} buffer
 * @param {number} start
 * @param {number} end
 * @yield {T}
 */
export function* ringBuffer(buffer, start, end) {
    for (let i of range(start, end)) {
        yield buffer[i % buffer.length];
    }
}
