function craft() {
    const craftingSlots = document.querySelectorAll(".craftingSlot");
    const outputSlot = document.querySelector(".outputSlot");

    if (outputSlot.querySelector(".item")) {
        removeItemFromSlot(outputSlot);
    }

    const items = [];
    craftingSlots.forEach(slot => {
        const item = slot.querySelector(".item");
        if (item) {

            const itemData = JSON.parse(item.dataset.fullItemData);
            items.push(itemData);
        }
    });

    if (items.length < 2) {
        return;
    }

    const craftedItem = createNewItem(items);
    addItemToSlot(outputSlot, craftedItem);

    craftingSlots.forEach(slot => removeItemFromSlot(slot));
}


function createNewItem(items) {
    // const itemName = items.map(item => item.Name).join(" + ");
    const newitemTypeName = calculateNewNameType(items);
    const itemName = newitemTypeName.Name;
    const itemType = newitemTypeName.Type;

    const numericFields = Object.keys(items[0]).filter(key =>
        key !== "Name" && key !== "Type"
    );

    const totalFields = numericFields.reduce((acc, key) => {
        acc[key] = items.reduce((sum, item) => sum + Number(item[key]), 0);
        return acc;
    }, {});

    return { Name: itemName, Type: itemType, ...totalFields };
}

function showTemporaryItem() {
    const craftingSlots = document.querySelectorAll(".craftingSlot");
    const outputSlot = document.querySelector(".outputSlot");

    if (outputSlot.querySelector(".item") && outputSlot.querySelector(".item").draggable) {
        return;
    } else {
        removeItemFromSlot(outputSlot);
    }

    const items = [];
    craftingSlots.forEach(slot => {
        const item = slot.querySelector(".item");
        if (item) {

            const itemData = JSON.parse(item.dataset.fullItemData);
            items.push(itemData);
        }
    });

    if (items.length < 2) {

        if (outputSlot.querySelector(".item") && !outputSlot.querySelector(".item").draggable) {
            removeItemFromSlot(outputSlot);
        }

        return;
    }

    const craftedItem = createNewItem(items);
    displayTempItem(outputSlot, craftedItem);
}


function displayTempItem(slot, itemData) {
    const item = document.createElement("div");
    item.classList.add("item");
    item.draggable = false;
    item.style.border = "3px solid rgba(35, 62, 182, 0.34)";
    item.style.cursor = "default";

    item.dataset.fullItemData = JSON.stringify(itemData);

    const label = document.createElement("div");
    label.classList.add("item-label");
    label.textContent = itemData.Name;

    // Add tooltip event listeners
    item.addEventListener("mouseenter", (e) => showTooltip(e, itemData));
    item.addEventListener("mousemove", (e) => moveTooltip(e));
    item.addEventListener("mouseleave", hideTooltip);

    item.appendChild(label);
    slot.appendChild(item);

    addDragAndDropEvents();
}



function calculateNewNameType(items) {
    let name = "ERROR";
    let type = "Meal";

    if (items[0].Type === "Soup") {

        const adjective = items[0].Adjective;
        name = `${adjective} ${items[1].Name} Soup`;

        if (items[2] && items[1]) {
            name = `${adjective} ${items[1].Name} and ${items[2].Name} Soup`;
        }
    } else if ((items[0].Type === "Plate" || items[0].Type === "Bowl") && items[1].Type === "Soup") {
        const adjective = items[0].Adjective;

        name = `${adjective} ${items[1].Name} flavored ${items[0].Name}`;
        if (items[2] && items[1]) {
            name = `${adjective} ${items[1].Name} flavored ${items[0].Name} with ${items[2].Name}`;
        }
    } else if ((items[0].Type === "Plate" || items[0].Type === "Bowl")) {
        const adjective = items[0].Adjective;
        name = `${adjective} ${items[1].Name} and ${items[0].Name} ${items[0].Type}`;
        if (items[2] && items[1]) {
            name = `${adjective} ${items[0].Name}, ${items[1].Name} and ${items[2].Name} ${items[0].Type}`;
        }
    }

    


    // Default case
    return { Name: name, Type: type };

}
