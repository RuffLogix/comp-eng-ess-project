export const generateRoomId = (idLength) => {
    return Math.random().toString(idLength).slice(2);
}