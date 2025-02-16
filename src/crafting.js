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

    if (items.length < 3) {
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

    const totalLevel = items.reduce((sum, item) => sum + Number(item.Level), 0) + 1;

    const numericFields = Object.keys(items[0]).filter(key =>
        key !== "Name" && key !== "Level" && key !== "Type"
    );

    const averagedFields = numericFields.reduce((acc, key) => {
        acc[key] = (items.reduce((sum, item) => sum + Number(item[key]), 0) / items.length).toFixed(0);
        return acc;
    }, {});

    return { Name: itemName, Level: totalLevel, Type: itemType, ...averagedFields };
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

    if (items.length < 3) {

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

/* 
Ingredient mixes:
mushroom
berry
herb
nut
meat
fruit
root
egg
grain
leaf
liquid

T2 ingredients
Flour


T3 ingredients
Dough

grain + grain + grain = flour | name = grain:name if all 3 flours are the same otherwise "Mixed Flour"
egg + egg + egg = scrambled eggs
egg + flour + liquid = "<flour type> Dough"
<fruit/berry/leaf> + <fruit/berry/leaf> + <any> = "<A + B + C> Salad"
Dough + <fruit/berry/root/nut> + <fruit/berry/root/nut> = "<B + C> Pie"
*/




function calculateNewNameType(items) {
    let name = "Mishmash";
    let type = "mishmash";

    const itemNames = items.map(item => item.Name);
    const itemTypes = items.map(item => item.Type);

    console.log(itemNames + " " + itemTypes);

    if (itemNames.every(name => name === "Water")) {
        name = "Water";
        type = "liquid";
    } else if (itemTypes.every(type => type === itemTypes[0])) {
        switch (itemTypes[0]) {
            case "mushroom":
                name = "Mixed Mushrooms";
                type = "mushroom";
                break;

            case "berry":
                name = "Mixed Berries";
                type = "berry";
                break;

            case "herb":
                name = itemNames[0] + " Seasonings";
                type = "herb";
                break;

            case "nut":
                name = "Mixed Nuts";
                type = "nut";
                break;

            case "meat":
                name = "Mystery Meat";
                type = "meat";
                break;

            case "fruit":
                name = "Fruit Salad";
                type = "fruit";
                break;

            case "root":
                name = "Various Roots";
                type = "root";
                break;

            case "egg":
                name = "Scrambled Eggs";
                type = "egg";
                break;

            case "grain":
                if (itemNames.every(name => name === itemNames[0])) {
                    name = itemNames[0] + " Flour";
                } else {
                    name = "Mixed Flour";
                }
                type = "flour";
                break;

            case "leaf":
                name = "Boring Salad";
                type = "Salad";
                break;

            case "liquid":
                name = "Soup";
                type = "liquid";
                break;

            default:
                break;
        }
    } else if (itemTypes.includes("liquid") && itemTypes.includes("egg") && itemTypes.includes("flour")) {
        const flourItem = items.find(item => item.Type === "flour");
        name = flourItem.Name.replace(" Flour", "") + " Dough";
        type = "dough";

    }


    // Default case
    return { Name: name, Type: type };

}
