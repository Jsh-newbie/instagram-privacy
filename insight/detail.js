(function () {
  var id = window.ITEM_ID;
  var src = window.DATA_SRC;

  fetch(src)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var item = data.items.find(function (i) { return i.id === id; });
      if (!item) return;
      render(item);
    });

  function render(item) {
    // 커버
    var coverEl = document.createElement('div');
    coverEl.className = 'cover';
    if (item.cover_image) {
      coverEl.style.backgroundImage = 'url(' + item.cover_image + ')';
    } else {
      coverEl.style.background = item.cover_gradient;
    }
    coverEl.innerHTML =
      '<div>' +
        '<p class="cover__label">' + esc(item.label) + '</p>' +
        '<h1 class="cover__title">' + esc(item.title).replace(/—/, '<br/>—') + '</h1>' +
      '</div>' +
      '<span class="cover__badge">' + esc(item.type) + '</span>';

    // 메타 칩
    var chips = [item.subject, item.grade, item.type,
      item.status === 'coming_soon' ? '준비 중' : '다운로드 가능'];
    var metaRow = '<div class="meta-row">' +
      chips.map(function (c) { return '<span class="meta-chip">' + esc(c) + '</span>'; }).join('') +
      '</div>';

    // 소개
    var intro =
      '<p class="section-label">자료 소개</p>' +
      '<div class="desc-block">' +
        '<p><b>' + esc(item.intro) + '</b></p>' +
        (item.intro_sub ? '<p>' + esc(item.intro_sub) + '</p>' : '') +
      '</div>';

    // 추천 대상
    var targets =
      '<p class="section-label">이런 분께 추천해요</p>' +
      '<ul class="target-list">' +
      item.targets.map(function (t) {
        return '<li><span class="target-list__icon">✓</span><span>' + esc(t) + '</span></li>';
      }).join('') +
      '</ul>';

    // 혜택
    var benefits =
      '<p class="section-label">이 자료로 얻을 수 있는 것</p>' +
      '<ul class="benefit-list">' +
      item.benefits.map(function (b, i) {
        var num = String(i + 1).padStart(2, '0');
        return '<li><span class="benefit-list__num">' + num + '</span><span>' + esc(b) + '</span></li>';
      }).join('') +
      '</ul>';

    // 미리보기 — 첫 번째는 커버 이미지와 동기화
    var preview0 = item.cover_image || null;
    var preview1 = item.preview_images && item.preview_images[1] ? item.preview_images[1] : null;

    function previewSlot(imgSrc) {
      if (imgSrc) {
        return '<div class="preview-slot"><img src="' + esc(imgSrc) + '" alt="미리보기" /></div>';
      }
      return '<div class="preview-slot"><span style="font-size:24px;opacity:0.2;">📄</span><span class="preview-slot__placeholder">PREVIEW</span></div>';
    }

    var previews =
      '<p class="section-label">미리보기</p>' +
      '<div class="preview-grid">' +
        previewSlot(preview0) +
        previewSlot(preview1) +
      '</div>';

    var divider = '<hr class="divider" />';

    var root = document.getElementById('root');
    root.innerHTML =
      '<div class="content">' +
        metaRow +
        intro + divider +
        targets + divider +
        benefits + divider +
        previews +
      '</div>';

    root.insertAdjacentElement('beforebegin', coverEl);

    // CTA
    var cta = document.getElementById('floatCta');
    var btn = document.getElementById('ctaBtn');
    cta.style.display = '';
    if (item.download_url) {
      btn.classList.remove('float-cta__btn--disabled');
      btn.removeAttribute('aria-disabled');
      btn.href = item.download_url;
      btn.textContent = '자료 다운로드';
    }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
