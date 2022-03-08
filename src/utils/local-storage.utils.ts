const write = (key: string, data: any) => {
    if (typeof localStorage === 'undefined') throw new Error('localStorage is undefined!');
    
    localStorage.setItem(key, JSON.stringify(data));
};

const exists = (key: string) => {
    if (typeof localStorage === 'undefined') throw new Error('localStorage is undefined!');

    return !!localStorage.getItem(key);
};

const read = <T>(key: string) => {
    if (typeof localStorage === 'undefined') throw new Error('localStorage is undefined');

    if (exists(key)) {
        return JSON.parse(localStorage.getItem(key)!) as T;
    }

    return undefined;
};

export default {
    write,
    read,
    exists
};
