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
      <div class="error-message-ia"><p><strong>Erro ao gerar resposta!</strong><br><br> 
      <strong>Possíveis erros:</strong><br>
      - Você chegou ao limite de requisições da IA.<br>
      - A resposta foi mal gerada ou com formatação inválida.<br>
      - Houve muitas requisições internas ao mesmo tempo.<br><br>
      <strong>O que fazer?</strong> <br>
      - Envie outra mensagem.<br>
      - Recarregue o site (seu histórico de conversar irá desaparecer).<br>
      - Tente acessar amanhã o site.
      </div>
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

  promptInput.style.pointerEvents = "none";
  submitButton.style.pointerEvents = "none";

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

    promptInput.style.pointerEvents = "all";
    submitButton.style.pointerEvents = "all";

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
