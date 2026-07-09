document.addEventListener("DOMContentLoaded", () => {
    const builder = document.getElementById("mh-step-builder");
    const addBtn = document.getElementById("mh-add-step");

    if (!builder || !addBtn) return;

    function updatePreview(card) {
        const input = card.querySelector(".mh-step-title-input");
        const preview = card.querySelector(".mh-step-title-preview");

        if (!input || !preview) return;

        preview.textContent = input.value.trim() || "New Step";
    }

    function resetCard(card) {
        card.querySelectorAll("input").forEach((input) => {
            input.value = "";
        });

        card.querySelectorAll("textarea").forEach((textarea) => {
            textarea.value = "";
        });

        card.querySelectorAll("select").forEach((select) => {
            select.selectedIndex = 0;
        });

        card.classList.remove("collapsed");

        updatePreview(card);
    }

    function bindCard(card) {
        if (card.dataset.bound === "true") return;

        const toggle = card.querySelector(".mh-step-toggle");
        const titleInput = card.querySelector(".mh-step-title-input");
        const removeBtn = card.querySelector(".mh-remove-step");

        if (!toggle || !titleInput || !removeBtn) return;

        toggle.addEventListener("click", () => {
            card.classList.toggle("collapsed");
        });

        titleInput.addEventListener("input", () => {
            updatePreview(card);
        });

        removeBtn.addEventListener("click", () => {
            const cards = builder.querySelectorAll(".mh-step-card");

            if (cards.length === 1) {
                resetCard(card);
                return;
            }

            card.remove();
        });

        card.dataset.bound = "true";

        updatePreview(card);
    }

    builder.querySelectorAll(".mh-step-card").forEach(bindCard);

    addBtn.addEventListener("click", () => {
        const firstCard = builder.querySelector(".mh-step-card");

        if (!firstCard) return;

        const clone = firstCard.cloneNode(true);

        delete clone.dataset.bound;

        resetCard(clone);
        bindCard(clone);

        builder.appendChild(clone);

        clone.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});