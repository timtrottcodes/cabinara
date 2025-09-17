# 🗂️ Cabinara -- The Universal Collection Showcase

**Cabinara** is a lightweight, schema-driven web application for
curators, collectors, and enthusiasts who want to present their
collections online in a flexible and beautiful way.

Inspired by the historic *Cabinets of Curiosities*, Cabinara transforms
CSV data into a fully navigable, searchable, and filterable digital
showcase. Whether you collect stamps, coins, postcards, trading cards,
or rare artifacts, Cabinara adapts to your data structure and puts your
treasures on display.

👉 Demo at [TimTrottCodes](https://timtrottcodes.github.io/cabinara/)

------------------------------------------------------------------------

## ✨ Features

-   **Schema-driven design** -- define fields, filters, categories, and
    search options in a simple CSV.
-   **Dynamic navigation** -- categories and filters are generated
    automatically from your dataset.
-   **Universal collections** -- works with stamps, coins, books, vinyl,
    trading cards, or any item type you define.
-   **Single-page app** -- built with HTML5, Tailwind CSS, and jQuery
    for simplicity and speed.
-   **Lightbox & modal support** -- clean, interactive item detail views
    without leaving the page.
-   **Minimal setup** -- just drop in your CSV files, no database
    required.

------------------------------------------------------------------------

## 🏛️ Why Cabinara?

Cabinara reimagines the *cabinet of curiosities* for the digital age: a
space where your personal collections can be preserved, organized, and
shared with the world --- without technical complexity.

------------------------------------------------------------------------

## 📂 Project Structure
```text
  /cabinara
    ├── index.html                    # Main app page
    ├── js/script.js                  # Core logic
    ├── css/styles.css                # Minimal style overrides
    ├── data/settings.json            # A few settings for the app
    ├── data/default/categories.csv   # Defines schema fields
    ├── data/default/collection.csv   # Your collection data
```

------------------------------------------------------------------------

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/timtrottcodes/cabinara.git
cd cabinara
```

---

### 2. Prepare your data folder

- Inside the `data/` directory, create a new subfolder for your collection.  
  For example:  

  ```
  /data/my-rock-collection/
  ```

- Copy the **default CSV files** from `/data/default/` into your new folder:  

  ```
  categories.csv
  collection.csv
  ```

- Your collection folder should look like:  

  ```
  /data/my-rock-collection/categories.csv
  /data/my-rock-collection/collection.csv
  /data/my-rock-collection/images/
  ```

---

### 3. Configure `categories.csv`

This file defines the **fields** for your collection items and how they behave in the app.  

Each row describes a field with the following columns:

| Column       | Purpose                                                                                   |
|--------------|-------------------------------------------------------------------------------------------|
| `field`      | Internal field name (no spaces, lowercase, must match collection.csv).                    |
| `display`    | Label shown in the UI.                                                                    |
| `category`   | If `true`, this field will appear as a navigation category.                               |
| `filter`     | If `true`, this field will appear as a sidebar filter with a dropdown list.               |
| `searchable` | If `true`, the field’s values will be included in full-text search.                       |
| `tags`       | If `true`, the field will be treated as a multi-tag field (`\|` separated values).         |

⚠️ **The order of rows in `categories.csv` determines the display order in the UI.**

**Example `categories.csv`:**

```csv
field,display,category,filter,searchable,tags
type,Type,true,true,false,false
category,Category,true,true,false,false
country,Country,false,true,false,false
size,Size,false,true,false,false
colour,Colour,false,true,false,false
quality,Quality,false,true,false,false
state,State,false,true,false,false
notes,Notes,false,false,true,false
tags,Tags,false,false,true,true
image,Image,false,false,false,false
thumbnail,Thumbnail,false,false,false,false
```

#### ✅ **Required Fields (must exist in `collection.csv`)**

1. **`id`**

   * Used as a unique identifier for each item.
   * Required for deep links, modal opening, and rendering.

2. **`image`**

   * Displayed as the main image in the grid and modal.
   * Can be a full URL or relative path.

3. **`thumbnail`**

   * Not currently displayed, but explicitly filtered out in the modal.
   * Can be used for performance optimizations (optional in rendering, but code expects the column).

4. **`title`** or **`name`**

   * At least one of them must exist for items to have a visible label.

5. **`subtitle`** (optional, but supported)

   * Displayed in smaller text under the title in the grid and modal.

6. **`notes`**

   * Shown in the modal under the "Notes" section.

7. **`tags`**

   * Used for the **multi-select filter**.
   * Expected to be a `|` delimited list (`Amethyst|Quartz|Purple`).
   * Displayed as pills in the modal.

---

### 4. Add items in `collection.csv`

- Each row represents one item in your collection.  
- The **columns must exactly match the fields defined in `categories.csv`**.  

**Example `collection.csv`:**

```csv
id,name,type,category,country,size,colour,quality,state,notes,tags,image,thumbnail
1,Amethyst Cluster,Semi-precious,Crystal,Brazil,10cm+,Purple,High,Natural,"Bought at gem fair","crystalline|translucent|birthstone-february","/data/my-rock-collection/images/amethyst.jpg","/data/my-rock-collection/images/amethyst-thumb.jpg"
2,Trilobite,Fossil,Arthropod,Morocco,5-10cm,Black,Medium,Fossilised,"Devonian period trilobite","fossil|rare|study-sample","/data/my-rock-collection/images/trilobite.jpg","/data/my-rock-collection/images/trilobite-thumb.jpg"
```

- `tags` use `|` to separate multiple values.  
- `image` and `thumbnail` can be **full URLs** or **relative paths** from the site root.

---

### 5. Add your images

- Place item images in your collection’s `images/` folder:

  ```
  /data/my-rock-collection/images/amethyst.jpg
  /data/my-rock-collection/images/amethyst-thumb.jpg
  ```

- Or host them externally and use full URLs in `collection.csv`.

👉 Demo at [TimTrottCodes](https://timtrottcodes.github.io/cabinara/)

------------------------------------------------------------------------

## 📜 License

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
