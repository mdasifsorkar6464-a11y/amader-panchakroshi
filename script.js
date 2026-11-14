const searchBox = document.getElementById("siteSearch");
const searchStatus = document.getElementById("searchStatus");

if (searchBox && searchStatus) {
  searchBox.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    const items = document.querySelectorAll(".item, .info-section");
    let matches = 0;

    items.forEach(function (item) {
      const found = item.textContent.toLowerCase().includes(query);
      item.classList.toggle("search-hidden", query !== "" && !found);
      if (query === "" || found) matches++;
    });

    if (query === "") {
      searchStatus.textContent = "আপনার প্রয়োজনীয় তথ্য খুঁজুন";
    } else if (matches > 0) {
      searchStatus.textContent = "মিল পাওয়া গেছে: " + matches + "টি";
    } else {
      searchStatus.textContent = "দুঃখিত, এই নামে এখনো কোনো তথ্য যোগ করা হয়নি।";
    }
  });
}
