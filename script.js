document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("siteSearch");
  const searchStatus = document.getElementById("searchStatus");

  if (!searchBox || !searchStatus) return;

  // Count only actual directory cards, not their parent sections.
  const searchableItems = document.querySelectorAll(".village-item, .directory-item");
  const religiousSections = document.querySelectorAll(".religion-subsection");
  const searchableSections = document.querySelectorAll(".info-section");

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit))
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getQueryVariants(query) {
    const aliases = [
      ["স্কুল", "বিদ্যালয়"],
      ["বিদ্যালয়", "স্কুল"],
      ["হাট", "বাজার"],
      ["বাজার", "হাট"],
      ["হাসপাতাল", "স্বাস্থ্য কমপ্লেক্স"],
      ["স্বাস্থ্য কমপ্লেক্স", "হাসপাতাল"]
    ];

    const variants = [query];
    aliases.forEach(function ([word, alternative]) {
      if (query.includes(word)) {
        variants.push(query.replace(word, alternative));
      }
    });
    return [...new Set(variants)];
  }

  function updateSearch() {
    const query = normalizeText(searchBox.value);
    const queryVariants = getQueryVariants(query);
    let matches = 0;

    searchableItems.forEach(function (item) {
      const itemText = normalizeText(item.textContent);
      const found = query === "" || queryVariants.some(term => itemText.includes(term));
      item.classList.toggle("search-hidden", !found);
      if (found && query !== "") matches++;
    });

    religiousSections.forEach(function (section) {
      const hasMatch = section.querySelector(".directory-item:not(.search-hidden)") !== null;
      section.classList.toggle("search-hidden", query !== "" && !hasMatch);
    });

    searchableSections.forEach(function (section) {
      const hasMatch =
        section.querySelector(".village-item:not(.search-hidden)") !== null ||
        section.querySelector(".directory-item:not(.search-hidden)") !== null;

      section.classList.toggle("search-hidden", query !== "" && !hasMatch);
    });

    if (query === "") {
      searchStatus.textContent = "আপনার প্রয়োজনীয় তথ্য খুঁজুন";
    } else if (matches > 0) {
      searchStatus.textContent = "মিল পাওয়া গেছে: " + matches + "টি";
    } else {
      searchStatus.textContent = "দুঃখিত, এই নামে এখনো কোনো তথ্য যোগ করা হয়নি।";
    }
  }

  searchBox.addEventListener("input", updateSearch);
  searchBox.addEventListener("search", updateSearch);
  searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && searchBox.value) {
      searchBox.value = "";
      updateSearch();
    }
  });
});
