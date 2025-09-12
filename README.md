# 🗂️ Cabinara -- The Universal Collection Showcase

**Cabinara** is a lightweight, schema-driven web application for
curators, collectors, and enthusiasts who want to present their
collections online in a flexible and beautiful way.

Inspired by the historic *Cabinets of Curiosities*, Cabinara transforms
CSV data into a fully navigable, searchable, and filterable digital
showcase. Whether you collect stamps, coins, postcards, trading cards,
or rare artifacts, Cabinara adapts to your data structure and puts your
treasures on display.

------------------------------------------------------------------------

## ✨ Features

-   **Schema-driven design** -- define fields, filters, categories, and
    search options in a simple CSV.
-   **Dynamic navigation** -- categories and filters are generated
    automatically from your dataset.
-   **Universal collections** -- works with stamps, coins, books, vinyl,
    or any item type you define.
-   **Single-page app** -- built with HTML5, Tailwind CSS, and jQuery
    for simplicity and speed.
-   **SEO-friendly deep links** -- every category and item has an
    indexable URL and metadata.
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

    /cabinara
      ├── index.html        # Main app page
      ├── app.js            # Core logic (CSV loading, filtering, navigation)
      ├── categories.csv    # Defines schema (fields, filters, categories)
      ├── collection.csv    # Your collection data
      ├── /assets           # Images, icons, CSS, JS

------------------------------------------------------------------------

## ⚡ Getting Started

1.  Clone the repository

    ``` bash
    git clone https://github.com/your-username/cabinara.git
    cd cabinara
    ```

2.  Place your `categories.csv` and `collection.csv` in the project
    root.

3.  Open `index.html` in your browser.

✅ That's it --- your collection is live!

------------------------------------------------------------------------

## 🛠️ Customization

-   Update `categories.csv` to change field names, filters, and
    navigation.\
-   Add styles in `tailwind.config.js` or custom CSS for branding.\
-   Extend `app.js` if you want custom behaviors (sorting, extra
    metadata, etc).

------------------------------------------------------------------------

## 📜 License

MIT License. Free to use, modify, and share.

------------------------------------------------------------------------

## 🌐 Credits

Built with ❤️ using **HTML5, Tailwind CSS, and jQuery**.\
Inspired by the timeless Cabinets of Curiosities.
