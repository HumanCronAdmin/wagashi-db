(() => {
  let products = [];
  const CATEGORY_LABEL = {
    mochi: "Mochi", manju: "Manju", yokan: "Yokan", daifuku: "Daifuku",
    dango: "Dango", senbei: "Senbei", monaka: "Monaka", namagashi: "Namagashi",
    higashi: "Higashi", dorayaki: "Dorayaki", taiyaki: "Taiyaki",
    imagawayaki: "Imagawayaki", anmitsu: "Anmitsu", zenzai: "Zenzai"
  };
  const SEASON_LABEL = {
    spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter", "all-year": "All Year"
  };
  const SEASON_ICON = {
    spring: "\uD83C\uDF38", summer: "\u2600\uFE0F", autumn: "\uD83C\uDF41", winter: "\u2744\uFE0F", "all-year": "\uD83D\uDD04"
  };
  const ANKO_LABEL = {
    koshian: "Koshian (Smooth)", tsubuan: "Tsubuan (Chunky)",
    shiroan: "Shiroan (White)", "no-anko": "No Anko"
  };

  const $ = id => document.getElementById(id);

  function populateFilters() {
    const cats = [...new Set(products.map(p => p.category))].sort();
    const seasons = [...new Set(products.map(p => p.season))].sort();
    const ankos = [...new Set(products.map(p => p.anko_type))].sort();

    cats.forEach(c => $("category").innerHTML += `<option value="${c}">${CATEGORY_LABEL[c] || c}</option>`);
    seasons.forEach(s => $("season").innerHTML += `<option value="${s}">${SEASON_LABEL[s] || s}</option>`);
    ankos.forEach(a => $("anko").innerHTML += `<option value="${a}">${ANKO_LABEL[a] || a}</option>`);
  }

  function getFiltered() {
    const q = $("search").value.toLowerCase();
    const cat = $("category").value;
    const sea = $("season").value;
    const ank = $("anko").value;
    const sort = $("sort").value;

    let list = products.filter(p => {
      if (cat && p.category !== cat) return false;
      if (sea && p.season !== sea) return false;
      if (ank && p.anko_type !== ank) return false;
      if (q && !p.name.toLowerCase().includes(q) && !(p.name_ja || "").includes(q)) return false;
      return true;
    });

    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "sweet-asc") list.sort((a, b) => a.sweetness - b.sweetness);
    else if (sort === "sweet-desc") list.sort((a, b) => b.sweetness - a.sweetness);

    return list;
  }

  function renderSweetness(level) {
    let dots = "";
    for (let i = 1; i <= 5; i++) {
      dots += `<span class="dot${i <= level ? " active" : ""}"></span>`;
    }
    return `<div class="sweetness">${dots}</div>`;
  }

  function renderCard(p) {
    const seasonIcon = SEASON_ICON[p.season] || "";
    const funFactHtml = p.fun_fact ? `<div class="fun-fact">${p.fun_fact}</div>` : "";

    return `<div class="product-card">
      <h3>${p.name} <span class="name-ja">${p.name_ja || ""}</span></h3>
      <div class="badges">
        <span class="badge badge-cat">${CATEGORY_LABEL[p.category] || p.category}</span>
        <span class="badge badge-season">${seasonIcon} ${SEASON_LABEL[p.season] || p.season}</span>
        <span class="badge badge-anko">${ANKO_LABEL[p.anko_type] || p.anko_type}</span>
      </div>
      ${renderSweetness(p.sweetness)}
      <p class="product-desc">${p.description}</p>
      <div class="product-meta">
        <span>Texture: ${p.texture}</span>
        <span>Shelf life: ${p.shelf_life}</span>
      </div>
      <div class="product-where"><strong>Where to try:</strong> ${p.where_to_try}</div>
      <div class="product-best"><strong>Best for:</strong> ${p.best_for}</div>
      ${funFactHtml}
    </div>`;
  }

  function render() {
    const list = getFiltered();
    $("resultCount").textContent = `${list.length} wagashi${list.length !== 1 ? " types" : " type"} found`;
    $("grid").innerHTML = list.map(renderCard).join("");
  }

  function init() {
    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        products = data;
        populateFilters();
        render();
      })
      .catch(err => {
        $("grid").innerHTML = `<p style="padding:24px;color:#78716C">Could not load wagashi data. ${err.message}</p>`;
      });

    ["search", "category", "season", "anko", "sort"].forEach(id => {
      $(id).addEventListener(id === "search" ? "input" : "change", render);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
