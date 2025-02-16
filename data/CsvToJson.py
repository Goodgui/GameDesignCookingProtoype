import csv
import os

def csv_to_js(csv_filename):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, csv_filename)
    
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        items = [dict(row) for row in reader]
    
    items = [{k: v for k, v in item.items() if v} for item in items]
    
    js_content = "function addTestItems() {\n    const testItems = [\n"
    js_content += ",\n".join(f"        {str(item)}" for item in items)
    js_content += "\n    ];\n\n    testItems.forEach(itemData => addItemToInventory(itemData));\n}"
    
    js_filename = os.path.join(script_dir, "..", "src", "additems.js")
    
    with open(js_filename, "w", encoding="utf-8") as jsfile:
        jsfile.write(js_content)
    
    print(f"JavaScript data written to {js_filename}")
    return js_content

# Example usage:
csv_to_js("ingredients.csv")
