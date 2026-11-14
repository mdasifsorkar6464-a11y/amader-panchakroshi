document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("siteSearch");
  const searchStatus = document.getElementById("searchStatus");

  if (!searchBox || !searchStatus) return;

  const searchableItems = document.querySelectorAll(
    ".village-item, .directory-item"
  );
  const searchableSections = document.querySelectorAll(".info-section");

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit))
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  searchBox.addEventListener("input", function () {
    const query = normalizeText(this.value);
    let matches = 0;

    searchableItems.forEach(function (item) {
      const found =
        query === "" || normalizeText(item.textContent).includes(query);

      item.classList.toggle("search-hidden", !found);
      if (found && query !== "") matches++;
    });

    searchableSections.forEach(function (section) {
      const visibleItems = section.querySelectorAll(
        ".village-item:not(.search-hidden), .directory-item:not(.search-hidden)"
      );
      const hasMatch = visibleItems.length > 0;

      section.classList.toggle(
        "search-hidden",
        query !== "" && !hasMatch
      );
    });

    if (query === "") {
      searchStatus.textContent = "আপনার প্রয়োজনীয় তথ্য খুঁজুন";
    } else if (matches > 0) {
      searchStatus.textContent = "মিল পাওয়া গেছে: " + matches + "টি";
    } else {
      searchStatus.textContent =
        "দুঃখিত, এই নামে এখনো কোনো তথ্য যোগ করা হয়নি।";
    }
  });
});
