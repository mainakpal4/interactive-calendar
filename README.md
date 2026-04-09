document.getElementById("export").onclick = () => {
const dataStr = JSON.stringify(notes, null, 2);
const blob = new Blob([dataStr], { type: "application/json" });

const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "notes.json";
a.click();
};
