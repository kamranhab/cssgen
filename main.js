const fileInput = document.getElementById("fileInput");
const htmlInput = document.getElementById("htmlInput");
const fileNameElement = document.getElementById("fileName");
const copyButton = document.getElementById("copyButton");

function handleFileUpload() {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      htmlInput.value = e.target.result;
    };

    reader.readAsText(file);

    fileNameElement.textContent = `File: ${file.name}`;
  } else {
    fileNameElement.textContent = "";
  }
  fileInput.value = "";
}

function handleDrop(event) {
  event.preventDefault();

  const htmlInput = document.getElementById("htmlInput");

  if (event.dataTransfer.items) {
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind === "file") {
        const file = event.dataTransfer.items[i].getAsFile();

        const reader = new FileReader();

        reader.onload = function (e) {
          htmlInput.value = e.target.result;
        };

        reader.readAsText(file);
      }
    }
  }
}

function handleDragOver(event) {
  event.preventDefault();
}

function generateCSS() {
  const htmlInput = document.getElementById("htmlInput");
  const cssOutput = document.getElementById("cssOutput");

  const classNames = [];
  const classRegex = /(className|class)\s*=\s*["']([^"']+)["']/g;

  let match;
  while ((match = classRegex.exec(htmlInput.value)) !== null) {
    const classes = match[2].split(/\s+/);
    classNames.push(...classes);
  }

  const uniqueClassNames = Array.from(new Set(classNames));

  if (uniqueClassNames.length > 0) {
    const cssContent = uniqueClassNames
      .map(
        (className) =>
          `<span class="class-name">.${className} </span><span class="braces">{</span><br><br><span class="braces">}</span>`
      )

      .join("\n\n");
    cssOutput.innerHTML = cssContent;

    document.getElementById("copyButton").style.display = "inline-block";
  } else {
    cssOutput.innerHTML = "No valid class names found.";
    document.getElementById("copyButton").style.display = "none";
  }
}

function clearInput() {
  htmlInput.value = "";
  cssOutput.textContent = "";
  fileNameElement.textContent = "";
}

function copyToClipboard() {
  const cssOutput = document.getElementById("cssOutput");
  const copyButton = document.getElementById("copyButton");

  const range = document.createRange();
  range.selectNode(cssOutput);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  try {
    navigator.clipboard
      .writeText(window.getSelection().toString())
      .then(() => {
        copyButton.textContent = "Copied!";
        copyButton.style.backgroundColor = "#28a745";
        copyButton.style.color = "#fff";

        setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.style.backgroundColor = "#fff";
          copyButton.style.color = "#000";
        }, 1200);
      })
      .catch((err) => {
        console.error("Unable to copy to clipboard:", err);
      });
  } catch (err) {
    console.error("Clipboard API not supported:", err);
  }

  window.getSelection().removeAllRanges();
}

function downloadCSS() {
  const cssOutput = document.getElementById("cssOutput").textContent;

  const blob = new Blob([cssOutput], { type: "text/css" });

  const link = document.createElement("a");

  link.download = "style.css";
  link.href = window.URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);
