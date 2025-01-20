const formatMoney = (x) => {
  return x.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

const chunkArray = (arr, chunkSize) => {
  try {
    let finalArr = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      finalArr.push(arr.slice(i, i + chunkSize));
    }

    return finalArr;
  } catch (err) {
    console.error("Internal Server Error: ", err);
  }
};

export const Utils = {
  formatMoney,
  chunkArray,
};
