export function formatETB(amount: number) {
  return `${amount.toLocaleString("en-ET")} ETB`;
}

export function buildOrderMessage(
  items: {
    name: string;
    color: string;
    quantity: number;
    price: number;
  }[],
) {
  const lines = items.map((item, index) => {
    const lineTotal = item.price * item.quantity;
    return `${index + 1}. ${item.name} (${item.color}) x${item.quantity} = ${formatETB(lineTotal)}`;
  });
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    "Hello Mira Islamic Gifts, I would like to order:",
    ...lines,
    `Total: ${formatETB(total)}`,
    "Name: ____",
    "Phone: ____",
  ].join("\n");
}
