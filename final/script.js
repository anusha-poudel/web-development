const imagePaths = {
  Birthday: "images/birthday.jpg",
  Wedding: "images/wedding.jpg",
  Graduation: "images/grad.jpg",
  Anniversary: "images/aniversary.jpg"
};

const typeSelect = document.getElementById("cardType");
const messageInput = document.getElementById("cardMessage");
const previewCard = document.getElementById("previewCard");
const previewTitle = document.getElementById("previewTitle");
const previewMessage = document.getElementById("previewMessage");
const generateBtn = document.getElementById("generateCard");

generateBtn.addEventListener("click", () => {
  const type = typeSelect.value;
  const message = messageInput.value;
  
  // Set background image
  previewCard.style.backgroundImage = `url('${imagePaths[type]}')`;

  // Set card type title
  previewTitle.textContent = type;

  // Set card message
  previewMessage.textContent = message;
});
