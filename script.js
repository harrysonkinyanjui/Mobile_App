
const numberInput = document.getElementById("numberInput");
const fromBase = document.getElementById("fromBase");
const toBase = document.getElementById("toBase");
const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");
const resultElement = document.getElementById("result");
const resultBase = document.getElementById("resultBase");
const errorMessage = document.getElementById("errorMessage");
const copyButton = document.getElementById("copyButton");

let lastResult = "";

// Convert a number from its selected base into a BigInt.
function parseNumber(value, base) {
  const digits = "0123456789ABCDEF";
  let text = value.trim().toUpperCase();

  if (text === "") {
    throw new Error("Please enter a number.");
  }

  let negative = false;

  if (text.startsWith("-")) {
    negative = true;
    text = text.slice(1);
  } else if (text.startsWith("+")) {
    text = text.slice(1);
  }

  if (text === "") {
    throw new Error("Please enter a valid number.");
  }

  let number = 0n;
  const bigBase = BigInt(base);

  for (const character of text) {
    const digit = digits.indexOf(character);

    if (digit < 0 || digit >= base) {
      throw new Error(
        `Invalid digit "${character}" for base ${base}.`
      );
    }

    number = number * bigBase + BigInt(digit);
  }

  return negative ? -number : number;
}

// Convert a BigInt into the requested base.
function formatNumber(number, base) {
  return number.toString(base).toUpperCase();
}

function convertNumber() {
  errorMessage.textContent = "";
  lastResult = "";
  copyButton.disabled = true;

  try {
    const originalBase = Number(fromBase.value);
    const targetBase = Number(toBase.value);

    const number = parseNumber(
      numberInput.value,
      originalBase
    );

    const converted = formatNumber(number, targetBase);

    resultElement.textContent = converted;
    resultBase.textContent = `BASE ${targetBase}`;

    lastResult = converted;
    copyButton.disabled = false;
  } catch (error) {
    resultElement.textContent = "No result yet";
    resultBase.textContent = `BASE ${toBase.value}`;
    errorMessage.textContent = error.message;
  }
}

convertButton.addEventListener("click", convertNumber);

numberInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    convertNumber();
  }
});

swapButton.addEventListener("click", function () {
  const previousResult = lastResult;
  const previousFrom = fromBase.value;

  fromBase.value = toBase.value;
  toBase.value = previousFrom;

  if (previousResult !== "") {
    numberInput.value = previousResult;
  }

  convertNumber();
});

copyButton.addEventListener("click", async function () {
  if (lastResult === "") return;

  try {
    await navigator.clipboard.writeText(lastResult);
    copyButton.textContent = "Copied!";
  } catch {
    errorMessage.textContent =
      "Copy is unavailable here. Select the result and copy it manually.";
  }
});

numberInput.addEventListener("input", function () {
  copyButton.textContent = "Copy result";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => {
        console.log("Offline support is ready.");
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
