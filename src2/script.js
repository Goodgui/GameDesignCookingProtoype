const hexSize = 75; // in pixels
const spacing = -4; // adjustment to spacing between hexagons
const craftingGridType = 1; // 1 = small, 2 = medium, 3 = large

document.addEventListener("DOMContentLoaded", async () => {
    document.documentElement.style.setProperty("--hex-size", `${hexSize}px`);

    // create inventory grid
    const container = document.getElementById("container1");
    const hexSlots = createInventoryGrid(20, 4, hexSize);
    hexSlots.forEach(slot => container.appendChild(slot));

    // create crafting grid
    const craftContainer = document.getElementById("container2");
    const craftingSlots = createCraftingGrid(craftingGridType, hexSize);
    craftingSlots.forEach(slot => craftContainer.appendChild(slot));

    // add test items to inventory
    addTestItems();

});

function createInventoryGrid(rows, cols, hexSize) {
    const slots = [];
    const hexHeight = hexSize + spacing;
    const hexWidth = Math.sqrt(3) * (hexSize / 2) + spacing;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const slot = document.createElement("div");
            slot.classList.add("slot");
            slot.id = `gridSlot${row * cols + col}`;

            // Positioning
            const x = col * hexWidth;
            const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

            slot.style.left = `${x}px`;
            slot.style.top = `${y}px`;

            const img = document.createElement("img");
            img.src = "hexagon.svg";
            img.alt = "Hexagon";
            img.classList.add("slot-image");

            slot.appendChild(img);
            slots.push(slot);
        }
    }
    return slots;
}

function createCraftingGrid(patternType, hexSize) {
    const slots = [];
    const hexHeight = -(hexSize / 2 + spacing / 2);
    const hexWidth = (Math.sqrt(3) * ((hexSize + spacing / 2) / 2) + spacing / 2);

    let positions = [];
    if (patternType === 1) {
        positions = [
            [0, 0],
            [hexWidth, -hexHeight],
            [hexWidth, hexHeight],
        ];
    } else if (patternType === 2) {
        positions = [
            [0, 0],
            [0, 2 * hexHeight],
            [0, -2 * hexHeight],
            [hexWidth, -hexHeight],
            [-hexWidth, -hexHeight],
            [hexWidth, hexHeight],
            [-hexWidth, hexHeight]
        ];
    } else if (patternType === 3) {
        positions = [
            [0, 0],
            [hexWidth, hexHeight],
            [hexWidth, -hexHeight],
            [2 * hexWidth, 0],
            [2 * hexWidth, -2 * hexHeight],
            [2 * hexWidth, 2 * hexHeight],
            [hexWidth, -3 * hexHeight],
            [0, -2 * hexHeight],
            [-hexWidth, -hexHeight],
            [hexWidth, 3 * hexHeight],
            [0, 2 * hexHeight],
            [-hexWidth, hexHeight]
        ];
    }

    positions.forEach((pos, index) => {
        const slot = document.createElement("div");
        slot.classList.add("craftingSlot");
        slot.id = `craftingSlot${index}`;

        slot.style.left = `${pos[0]}px`;
        slot.style.top = `${pos[1]}px`;

        const img = document.createElement("img");
        img.src = "hexagon.svg";
        img.alt = "Hexagon";
        img.classList.add("slot-image");

        if (index === 0) {
            const label = document.createElement("div");
            label.classList.add("item-label");
            label.textContent = "Main";
            slot.appendChild(label);
        } else if (index === 1) {
            const label = document.createElement("div");
            label.classList.add("item-label");
            label.textContent = "Secondary";
            slot.appendChild(label);
        } else if (index === 2) {
            const label = document.createElement("div");
            label.classList.add("item-label");
            label.textContent = "Garnish";
            slot.appendChild(label);
        }


        slot.appendChild(img);
        slots.push(slot);
    });



    return slots;
}

function addItemToInventory(itemData) {
    const slots = document.querySelectorAll(".slot");
    for (let slot of slots) {
        if (!slot.querySelector(".item")) {
            addItemToSlot(slot, itemData);
            return;
        }
    }
}

function addItemToSlot(slot, itemData) {
    const item = document.createElement("div");
    item.classList.add("item");
    item.draggable = true;

    // Store each property as a dataset attribute
    // for (const key in itemData) {
    //     if (itemData.hasOwnProperty(key)) {
    //         item.dataset[key] = itemData[key];
    //     }
    // }

    // Store the entire itemData object as a JSON string in a data attribute
    item.dataset.fullItemData = JSON.stringify(itemData);
    item.style.backgroundColor = "#1e1e1e";

    const img = document.createElement("img");
    img.src = "hexagon.svg";
    img.alt = itemData.Name;
    img.classList.add("item-image");

    const label = document.createElement("div");
    label.classList.add("item-label");
    label.textContent = itemData.Name;

    // Add tooltip event listeners
    item.addEventListener("mouseenter", (e) => showTooltip(e, itemData));
    item.addEventListener("mousemove", (e) => moveTooltip(e));
    item.addEventListener("mouseleave", hideTooltip);

    item.appendChild(img);
    item.appendChild(label);
    slot.appendChild(item);

    addDragAndDropEvents();
}


function removeItemFromSlot(slot) {
    const item = slot.querySelector(".item");
    if (item) {
        item.remove();
        shiftItems();
    }
}

function shiftItems() {
    // ChatGPT can't figure it out, so i'll add it later
}

function addDragAndDropEvents() {
    let draggedItem = null;
    let previousSlot = null;

    let slots = [
        ...document.querySelectorAll(".slot"),
        ...document.querySelectorAll(".craftingSlot"),
        ...document.querySelectorAll(".outputSlot")
    ];

    slots.forEach(slot => {
        slot.addEventListener("dragover", (e) => {
            if (!slot.querySelector(".item")) {
                e.preventDefault();
            }
        });

        slot.addEventListener("drop", (e) => {
            e.preventDefault();
            if (!slot.querySelector(".item") && draggedItem && !slot.classList.contains("outputSlot")) {
                previousSlot.querySelector(".item").remove();
                slot.appendChild(draggedItem);
                shiftItems();
                showTemporaryItem();
            }
        });
    });

    document.querySelectorAll(".item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            draggedItem = item;
            previousSlot = item.parentElement;
            e.dataTransfer.setData("text/plain", "");
            setTimeout(() => { item.style.display = "none"; }, 0);
            hideTooltip();
        });

        item.addEventListener("dragend", () => {
            if (draggedItem) {
                draggedItem.style.display = "flex";
            }
            draggedItem = null;
        });
    });
}


