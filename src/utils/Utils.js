const formatMoney = (x) => {
  return x.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

export const Utils = {
  formatMoney,
};
