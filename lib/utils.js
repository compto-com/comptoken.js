const { SEC_PER_DAY } = require("./constants.js");

/**
 * @param {BigInt} int 
 * @returns {Uint8Array}
 */
function bigintAsU64ToBytes(int) {
    let arr = new Uint8Array(8);
    for (let i = 0; int > 0n; ++i) {
        arr[i] = Number(int & 255n);
        int >>= 8n;
    }
    return arr;
}

/**
 * @param {number} num
 * @returns {Uint8Array}
 */
function numAsU16ToLEBytes(num) {
    let buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(num);
    return Uint8Array.from({ length: 2 }, (v, i) => buffer.readUint8(i));
}

/**
 * @param {number} num
 * @returns {Uint8Array}
 */
function numAsU32ToLEBytes(num) {
    let buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(num);
    return Uint8Array.from({ length: 4 }, (v, i) => buffer.readUInt8(i))
}

/**
 * @template T
 * @param {T | null | undefined} val
 * @returns {T | null}
 */
function toOption(val) {
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
function getOptionOr(opt_val, fn) {
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
    for (let i = Number(start); i < Number(end); i++) {
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
function* ringBuffer(buffer, start, end) {
    for (let i of range(start, end)) {
        yield buffer[i % buffer.length];
    }
}

/**
 * @param {Date} time 
 * @returns {Date}
 */
function normalizeTime(time) {
    return new Date(time.getTime() - (time.getTime() % (SEC_PER_DAY * 1000)));
}

/**
 * @param  {...Iterable<any>} iterables 
 */
function* zip(...iterables) {
    let iterators = iterables.map(it => it[Symbol.iterator]());
    while (true) {
        let result = [];
        for (let it of iterators) {
            let next = it.next();
            if (next.done) {
                return;
            }
            result.push(next.value);
        }
        yield result;
    }
}

module.exports = {
    bigintAsU64ToBytes,
    numAsU16ToLEBytes,
    numAsU32ToLEBytes,
    toOption,
    getOptionOr,
    ringBuffer,
    normalizeTime,
    zip,
};

