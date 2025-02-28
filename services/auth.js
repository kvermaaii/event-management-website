const sesionIdToUserMap = new Map();
export function setUser(id,user){
    sesionIdToUserMap.set(id,user);
}
export function getUser(id){
    return sesionIdToUserMap.get(id);
}