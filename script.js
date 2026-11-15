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


/* Panchakroshi union location map */
document.addEventListener("DOMContentLoaded", function () {
  const openButton = document.getElementById("showUnionLocation");
  const closeButton = document.getElementById("closeUnionLocation");
  const panel = document.getElementById("unionLocationPanel");
  const mapNode = document.getElementById("unionMap");
  if (!openButton || !panel || !mapNode) return;
  let mapStarted = false;
  function showMap() {
    panel.hidden = false;
    openButton.setAttribute("aria-expanded", "true");
    if (mapStarted) { if (window.unionMapInstance) setTimeout(() => window.unionMapInstance.invalidateSize(), 100); return; }
    mapStarted = true;
    mapNode.innerHTML = '<p class="map-loading">মানচিত্র লোড হচ্ছে…</p>';
    const loadLeaflet = () => {
      if (window.L) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    loadLeaflet().then(() => {
      mapNode.innerHTML = "";
      const map = L.map(mapNode, { scrollWheelZoom: false, maxZoom: 18 }).setView([24.3243, 89.6001], 13);
      window.unionMapInstance = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      const query = "https://services.arcgis.com/5T5nSi527N4F7luB/ArcGIS/rest/services/bgd_adm4_union/FeatureServer/0/query?where=ADM4_EN%3D%27Pancha%20Krushi%27%20AND%20ADM3_EN%3D%27Ullapara%27%20AND%20ADM2_EN%3D%27Sirajganj%27&outFields=ADM4_EN%2CADM3_EN%2CADM2_EN%2CADM4_PCODE&returnGeometry=true&outSR=4326&f=geojson";
      fetch(query).then(response => {
        if (!response.ok) throw new Error("Boundary unavailable");
        return response.json();
      }).then(data => {
        if (!data.features || !data.features.length) throw new Error("Boundary not found");
        if (data.features.length !== 1) throw new Error("Expected exactly one union boundary");
        const feature = data.features[0];
        const props = feature.properties || {};
        if (props.ADM4_EN !== "Pancha Krushi" || props.ADM3_EN !== "Ullapara" || props.ADM2_EN !== "Sirajganj") throw new Error("Boundary did not match Panchakroshi Union");
        const boundary = L.geoJSON(feature, { style: { color: "#075f45", weight: 4, opacity: 1, fillColor: "#45ad78", fillOpacity: 0.12, lineJoin: "round" } }).addTo(map);
        const bounds = boundary.getBounds();
        map.fitBounds(bounds, { padding: [18, 18] });
        map.setMaxBounds(bounds.pad(0.04));
        boundary.bindPopup("পঞ্চক্রোশী ইউনিয়ন · উল্লাপাড়া · সিরাজগঞ্জ");
      }).catch(() => {
        mapNode.insertAdjacentHTML("afterend", '<p class="map-boundary-note">পঞ্চক্রোশী ইউনিয়নের নির্ভুল সীমানার ডেটা এখন পাওয়া যায়নি। ভুল লোকেশন বা অনুমানভিত্তিক সীমানা দেখানো হচ্ছে না।</p>');
      });
      setTimeout(() => map.invalidateSize(), 150);
    }).catch(() => {
      mapNode.innerHTML = '<p class="map-loading">মানচিত্র লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>';
      mapStarted = false;
    });
  }
  openButton.addEventListener("click", showMap);
  if (closeButton) closeButton.addEventListener("click", () => {
    panel.hidden = true;
    openButton.setAttribute("aria-expanded", "false");
  });
});
