function getParseLocalStorage(name: string) {
    const getString = localStorage.getItem(name);
    if (getString)
        return JSON.parse(getString);
    return null;
}

export default getParseLocalStorage;