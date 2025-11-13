(function(){
  const $ = id => document.getElementById(id);

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const escapeHTML = s =>
    s ? s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) : "";

  function renderList(data, id){
    const ul = $(id);
    ul.classList.remove('skeleton');
    if(!Array.isArray(data) || data.length===0){
      ul.innerHTML = '<li class="pub-item">None</li>';
      return;
    }

    ul.innerHTML = data.map(item => {
      const title = escapeHTML(item.title || "");
      const venue = escapeHTML(item.venue || "");
      const authors = item.authors || "";
      const link = item.link ? item.link : "";
      const titleHTML = link
        ? `<a href="${link}" target="_blank" rel="noopener">${title}</a>`
        : title;
      return `
        <li class="pub-item">
          <div class="pub-title">${titleHTML}</div>
          <div class="pub-meta">${authors}</div>
          <div class="pub-venue">${venue}</div>
        </li>`;
    }).join("");
  }


  async function loadPublications(){
    try{
      const res = await fetch("data/publications.json");
      if(!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      renderList(data.journals, "journals");
      renderList(data.intl_refereed, "intl_refereed");
      renderList(data.intl_nonrefereed, "intl_nonrefereed");
      renderList(data.domestic, "domestic");
      renderList(data.awards, "awards-list");
    }catch(e){
      console.error(e);
      ["journals","intl_refereed","intl_nonrefereed","domestic","awards-list"]
        .forEach(id => $(id).innerHTML = '<li class="pub-item">データ取得に失敗しました。</li>');
    }
  }

  loadPublications();
})();