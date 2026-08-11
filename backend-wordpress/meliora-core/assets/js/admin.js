document.addEventListener("DOMContentLoaded", () => {

    const builder = document.getElementById("mh-step-builder");
    const addBtn = document.getElementById("mh-add-step");

    if (!builder || !addBtn) {
        return;
    }

    /* ==========================================================
       UPDATE STEP TITLE PREVIEW
    ========================================================== */

    function updatePreview(card) {

        const input =
            card.querySelector(".mh-step-title-input");

        const preview =
            card.querySelector(".mh-step-title-preview");

        if (!input || !preview) {
            return;
        }

        preview.textContent =
            input.value.trim() || "New Step";
    }

    /* ==========================================================
       UPDATE STEP NUMBERS
    ========================================================== */

    function updateStepNumbers() {

        const cards =
            builder.querySelectorAll(".mh-step-card");

        cards.forEach((card, index) => {

            const numberPreview =
                card.querySelector(
                    ".mh-step-number-preview"
                );

            if (!numberPreview) {
                return;
            }

            numberPreview.textContent =
                `STEP ${String(index + 1).padStart(2, "0")}`;

        });

    }

    /* ==========================================================
       RESET A CLONED STEP
    ========================================================== */

    function resetCard(card) {

        /*
        |--------------------------------------------------------------------------
        | Clear Text Inputs
        |--------------------------------------------------------------------------
        */

        card
            .querySelectorAll(
                'input:not([type="hidden"])'
            )
            .forEach((input) => {

                input.value = "";

            });

        /*
        |--------------------------------------------------------------------------
        | New Step â†’ Empty UUID
        |--------------------------------------------------------------------------
        |
        | SaveRoadmap.php will generate a new UUID when
        | the roadmap is saved.
        |--------------------------------------------------------------------------
        */

        const stepId =
            card.querySelector(
                'input[name="mh_steps[id][]"]'
            );

        if (stepId) {
            stepId.value = "";
        }

        /*
        |--------------------------------------------------------------------------
        | Clear Textareas
        |--------------------------------------------------------------------------
        */

        card
            .querySelectorAll("textarea")
            .forEach((textarea) => {

                textarea.value = "";

            });

        /*
        |--------------------------------------------------------------------------
        | Reset Selects
        |--------------------------------------------------------------------------
        */

        card
            .querySelectorAll("select")
            .forEach((select) => {

                select.selectedIndex = 0;

            });

        /*
        |--------------------------------------------------------------------------
        | Open New Step
        |--------------------------------------------------------------------------
        */

        card.classList.remove("collapsed");

        updatePreview(card);
    }

    /* ==========================================================
       CREATE BLANK STEP FROM EXISTING CARD
    ========================================================== */

    function createBlankStep(sourceCard) {

        const clone =
            sourceCard.cloneNode(true);

        /*
        |--------------------------------------------------------------------------
        | Allow Event Listeners To Be Rebound
        |--------------------------------------------------------------------------
        */

        clone.removeAttribute("data-bound");

        resetCard(clone);

        bindCard(clone);

        return clone;
    }

    /* ==========================================================
       BIND STEP CARD
    ========================================================== */

    function bindCard(card) {

        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Event Listeners
        |--------------------------------------------------------------------------
        */

        if (card.dataset.bound === "true") {
            return;
        }

        const toggle =
            card.querySelector(".mh-step-toggle");

        const titleInput =
            card.querySelector(
                ".mh-step-title-input"
            );

        const insertBtn =
            card.querySelector(
                ".mh-insert-step"
            );

        const removeBtn =
            card.querySelector(
                ".mh-remove-step"
            );

        if (
            !toggle ||
            !titleInput ||
            !insertBtn ||
            !removeBtn
        ) {
            return;
        }

        /* ------------------------------------------------------
           Collapse / Expand
        ------------------------------------------------------ */

        toggle.addEventListener(
            "click",
            () => {

                card.classList.toggle(
                    "collapsed"
                );

            }
        );

        /* ------------------------------------------------------
           Live Title Preview
        ------------------------------------------------------ */

        titleInput.addEventListener(
            "input",
            () => {

                updatePreview(card);

            }
        );

        /* ------------------------------------------------------
           INSERT STEP BELOW
        ------------------------------------------------------ */

        insertBtn.addEventListener(
            "click",
            () => {

                const clone =
                    createBlankStep(card);

                /*
                |--------------------------------------------------------------------------
                | Insert Immediately After Current Step
                |--------------------------------------------------------------------------
                */

                card.insertAdjacentElement(
                    "afterend",
                    clone
                );

                /*
                |--------------------------------------------------------------------------
                | Recalculate All Step Numbers
                |--------------------------------------------------------------------------
                */

                updateStepNumbers();

                /*
                |--------------------------------------------------------------------------
                | Scroll To New Step
                |--------------------------------------------------------------------------
                */

                clone.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                /*
                |--------------------------------------------------------------------------
                | Put Cursor In Step Name
                |--------------------------------------------------------------------------
                */

                const newTitleInput =
                    clone.querySelector(
                        ".mh-step-title-input"
                    );

                if (newTitleInput) {
                    newTitleInput.focus();
                }

            }
        );

        /* ------------------------------------------------------
           REMOVE STEP
        ------------------------------------------------------ */

        removeBtn.addEventListener(
            "click",
            () => {

                const cards =
                    builder.querySelectorAll(
                        ".mh-step-card"
                    );

                /*
                |--------------------------------------------------------------------------
                | Never Remove The Last Remaining Card
                |--------------------------------------------------------------------------
                */

                if (cards.length === 1) {

                    resetCard(card);

                    updateStepNumbers();

                    return;
                }

                card.remove();

                /*
                |--------------------------------------------------------------------------
                | Renumber Remaining Steps
                |--------------------------------------------------------------------------
                */

                updateStepNumbers();

            }
        );

        card.dataset.bound = "true";

        updatePreview(card);
    }

    /* ==========================================================
       INITIALIZE EXISTING STEPS
    ========================================================== */

    builder
        .querySelectorAll(".mh-step-card")
        .forEach(bindCard);

    /*
    |--------------------------------------------------------------------------
    | Make Sure Existing Steps Have Correct Numbers
    |--------------------------------------------------------------------------
    */

    updateStepNumbers();

    /* ==========================================================
       ADD STEP TO END
    ========================================================== */

    addBtn.addEventListener(
        "click",
        () => {

            const cards =
                builder.querySelectorAll(
                    ".mh-step-card"
                );

            if (!cards.length) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Clone Last Step
            |--------------------------------------------------------------------------
            */

            const sourceCard =
                cards[cards.length - 1];

            const clone =
                createBlankStep(sourceCard);

            /*
            |--------------------------------------------------------------------------
            | Add To End
            |--------------------------------------------------------------------------
            */

            builder.appendChild(clone);

            /*
            |--------------------------------------------------------------------------
            | Renumber
            |--------------------------------------------------------------------------
            */

            updateStepNumbers();

            /*
            |--------------------------------------------------------------------------
            | Scroll To New Step
            |--------------------------------------------------------------------------
            */

            clone.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            /*
            |--------------------------------------------------------------------------
            | Focus Step Name
            |--------------------------------------------------------------------------
            */

            const newTitleInput =
                clone.querySelector(
                    ".mh-step-title-input"
                );

            if (newTitleInput) {
                newTitleInput.focus();
            }

        }
    );

});


/* ==========================================================
   SMART TEXTAREA PASTE
========================================================== */

function normalizeClipboardText(text) {

    return text

        // Windows â†’ Unix
        .replace(/\r\n/g, "\n")

        // Convert bullets
        .replace(/[â€¢â–ªâ—¦â—]\s*/g, "- ")

        // Collapse excessive blank lines
        .replace(/\n{3,}/g, "\n\n")

        // Remove spaces around line breaks
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")

        .trimEnd();

}


document.addEventListener(
    "paste",
    (event) => {

        const textarea =
            event.target;

        if (
            !(
                textarea instanceof
                HTMLTextAreaElement
            )
        ) {
            return;
        }

        const text =
            event.clipboardData.getData(
                "text/plain"
            );

        if (!text) {
            return;
        }

        event.preventDefault();

        const cleaned =
            normalizeClipboardText(text);

        const start =
            textarea.selectionStart;

        const end =
            textarea.selectionEnd;

        textarea.setRangeText(
            cleaned,
            start,
            end,
            "end"
        );

    }
);
