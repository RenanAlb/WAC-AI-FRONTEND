const promptInput = document.getElementById("input-prompt");
const submitButton = document.getElementById("submit-button");
const containerChatElement = document.getElementById("container-chat");

const removeLoadingElement = () => {
  const loadingElement = document.querySelector(".loading-message-ia");
  if (loadingElement) loadingElement.remove();
};

const addMessageErrorGenerate = () => {
  removeLoadingElement();
  containerChatElement.innerHTML += `
    <div class="container-error-message-ia">
      <div class="error-message-ia"><p>Erro ao gerar resposta!<br><br> 
      O que fazer? <br>
      - Envie outra mensagem ou recarregue o site <br>
      - Recarregue o site (seu histórico de conversar irá desaparecer)</p></div>
    </div>
  `;
};

const scrollToBottom = async () => {
  containerChatElement.scrollTop = containerChatElement.scrollHeight;
};

const runAI = async () => {
  const question = promptInput.value.trim();

  promptInput.value = "";

  if (!question) {
    return console.error("Não foi preenchido o campo do input!");
  }

  containerChatElement.innerHTML += `
    <div class="container-user-message">
      <div class="user-message">
        <p>${question}</p>
      </div>
    </div>
    <div class="loading-message-ia">
      <l-dot-pulse
        id="loading-element"
        size="25"
        speed="1.3"
        color="white"
      ></l-dot-pulse>
    </div>
  `;

  scrollToBottom();

  try {
    const response = await fetch(
      "https://wac-ai-backend.onrender.com/ask-wac-ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );

    removeLoadingElement();

    if (!response.ok) {
      throw new Error("Erro ao chamar a Wac AI");
    }

    const data = await response.json();

    containerChatElement.innerHTML += `
      <div class="container-ia-message">
        <div class="ia-message">
          <p>${data.answer}</p>
        </div>
      </div>
    `;

    console.log(data);
  } catch (error) {
    addMessageErrorGenerate();
    console.error(error);
  }
};

submitButton.addEventListener("click", runAI);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runAI();
});
