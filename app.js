(function(){
  const $ = (id) => document.getElementById(id);

  // 年号
  document.getElementById('year').textContent = new Date().getFullYear();

  // HTMLエスケープ
  const escapeHTML = (s) =>
    s ? s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) : "";

  // 汎用レンダラ
  function renderList(data, id){
    const ul = $(id);
    ul.classList.remove('skeleton');
    if(!Array.isArray(data) || data.length===0){
      ul.innerHTML = '<li class="pub-item">なし</li>';
      return;
    }
    // publicationsとawardsで呼び出し先のクラスが違うが同じマークアップでOK
    ul.innerHTML = data.map(item => {
      const title = escapeHTML(item.title || '');
      const venue = escapeHTML(item.venue || '');
      const authors = item.authors || '';
      return `
        <li class="pub-item">
          <div class="pub-title">${title}</div>
          <div class="pub-meta">${authors}</div>
          <div class="pub-venue">${venue}</div>
        </li>`;
    }).join('');
  }

  async function loadPublications(){
    const ids = ["journals","intl_refereed","intl_nonrefereed","domestic"];
    try{
      const res = await fetch("data/publications.json?ver=" + Date.now());
      if(!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      ids.forEach(id => renderList(data[id], id));
      // Awardsはキー名が別
      const awardsUl = document.getElementById('awards-list');
      awardsUl.classList.remove('skeleton');
      if(Array.isArray(data.awards) && data.awards.length){
        awardsUl.innerHTML = data.awards.map(a => `<li class="pub-item">${escapeHTML(a)}</li>`).join("");
      }else{
        awardsUl.innerHTML = `<li class="pub-item">なし</li>`;
      }
    }catch(e){
      const all = ["journals","intl_refereed","intl_nonrefereed","domestic","awards-list"];
      all.forEach(id => {
        const ul = $(id);
        ul.classList.remove('skeleton');
        ul.innerHTML = `<li class="pub-item">データ取得に失敗しました。</li>`;
      });
      console.error(e);
    }
  }

  loadPublications();
})();
