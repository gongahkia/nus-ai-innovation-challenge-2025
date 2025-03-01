export const sortInventoryByUrgency = (inventory) => {
  return inventory.sort((a, b) => {
    const urgencyOrder = { high: 1, medium: 2, low: 3 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
};