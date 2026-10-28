/* ========================================
   商品詳細画像の設定

   表紙：
   images/CARDTOP/R01.png

   詳細画像：
   images/CARDTOP/R01-1.jpg
   images/CARDTOP/R01-2.jpg など

   数字は、その商品の詳細画像の枚数
======================================== */

const productDetails = {
  "R1.png": 5,
  "R2.png": 5,
  "R3.png": 3,
  "R4.png": 3,
  "R5.png": 3,
  "R6.png": 1,

  "T1.png": 3,
  "T2.png": 2,
  "T3.png": 3,
  "T4.png": 3,
  "T5.png": 3,
  "T6.png": 3,
  "T7.png": 3,
  "T8.png": 3,
  "T9.png": 1,
  "T10.png": 1,
  "T11.png": 2,
  "T13.png": 2,

  "C1.png": 3,

  "B1.png": 1,
  "B2.png": 2,
  "B3.png": 2,
  "B4.png": 1,

  "P1.png": 2,
  "P2.png": 2,
  "P3.png": 2,
  "P4.png": 1
};

/* ========================================
   商品詳細ポップアップを作成
======================================== */

const viewer = document.createElement("div");

viewer.className = "product-viewer";
viewer.setAttribute("role", "dialog");
viewer.setAttribute("aria-modal", "true");
viewer.setAttribute("aria-label", "商品詳細画像");

viewer.innerHTML = `
  <button
    class="viewer-close"
    type="button"
    aria-label="閉じる"
  >&times;</button>

  <button
    class="viewer-prev"
    type="button"
    aria-label="前の画像"
  >&#10094;</button>

  <div class="viewer-content">
    <img
      class="viewer-image"
      src=""
      alt="商品詳細画像"
    >

    <div
      class="viewer-count"
      aria-live="polite"
    ></div>
  </div>

  <button
    class="viewer-next"
    type="button"
    aria-label="次の画像"
  >&#10095;</button>
`;

document.body.appendChild(viewer);

/* ポップアップ内の要素 */
const viewerImage = viewer.querySelector(".viewer-image");
const viewerCount = viewer.querySelector(".viewer-count");
const closeButton = viewer.querySelector(".viewer-close");
const prevButton = viewer.querySelector(".viewer-prev");
const nextButton = viewer.querySelector(".viewer-next");

/* 現在表示している商品の詳細画像 */
let currentImages = [];
let currentIndex = 0;
let previousFocus = null;

/* ========================================
   詳細画像を表示
======================================== */

function showDetailImage(index) {
  if (currentImages.length === 0) {
    return;
  }

  /* 最後の画像の次は最初へ戻る */
  currentIndex =
    (index + currentImages.length) % currentImages.length;

  viewerImage.onerror = () => {
    viewerImage.alt =
      "画像を読み込めません。ファイル名と保存場所を確認してください。";

    viewerCount.textContent =
      `画像が見つかりません（${currentIndex + 1}枚目）`;
  };

  viewerImage.src = currentImages[currentIndex];

  viewerImage.alt =
    `商品詳細画像 ${currentIndex + 1}`;

  viewerCount.textContent =
    `${currentIndex + 1} / ${currentImages.length}`;
}

/* ========================================
   商品詳細ポップアップを開く
======================================== */

function openViewer(coverImage) {
  /* 表紙画像のファイル名を取得 */
  const fileName = coverImage
    .getAttribute("src")
    .split("/")
    .pop();

  /* 詳細画像の枚数を取得 */
  const imageCount = productDetails[fileName];

  /* 枚数設定がない商品は開かない */
  if (!imageCount) {
    console.warn(
      `productDetails に ${fileName} の枚数設定がありません。`
    );
    return;
  }

  /* 詳細画像の保存フォルダ */
  const folderPath = "images/CARDTOP/";

  /* 拡張子を取り除く */
  const baseName = fileName.replace(/\.[^.]+$/, "");

  /* 詳細画像のパスを作成 */
  currentImages = Array.from(
    { length: imageCount },
    (_, index) =>
      `${folderPath}${baseName}-${index + 1}.jpg`
  );

  /* 最初の詳細画像から表示 */
  currentIndex = 0;

  /* 開く前のフォーカス位置を保存 */
  previousFocus = document.activeElement;

  showDetailImage(currentIndex);

  /* ポップアップを表示 */
  viewer.classList.add("is-open");

  /* 背景ページのスクロールを停止 */
  document.body.classList.add("viewer-open");

  /* 閉じるボタンにフォーカス */
  closeButton.focus();
}

/* ========================================
   商品詳細ポップアップを閉じる
======================================== */

function closeViewer() {
  viewer.classList.remove("is-open");

  document.body.classList.remove("viewer-open");

  viewerImage.removeAttribute("src");

  currentImages = [];

  /* 開く前の場所にフォーカスを戻す */
  if (
    previousFocus &&
    typeof previousFocus.focus === "function"
  ) {
    previousFocus.focus();
  }
}

/* ========================================
   商品画像のクリックイベント
======================================== */

/*
  document に1回だけイベントを登録する。
  forEach の中に入れないこと。
*/

document.addEventListener("click", (event) => {
  const image = event.target.closest(
    ".collection .product-group .box img"
  );

  if (!image) {
    return;
  }

  openViewer(image);
});

/* ========================================
   前へ・次へボタン
======================================== */

/* 前の詳細画像 */
prevButton.addEventListener("click", () => {
  showDetailImage(currentIndex - 1);
});

/* 次の詳細画像 */
nextButton.addEventListener("click", () => {
  showDetailImage(currentIndex + 1);
});

/* ========================================
   閉じる操作
======================================== */

/* ×ボタンで閉じる */
closeButton.addEventListener("click", closeViewer);

/* ポップアップの背景をクリックして閉じる */
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    closeViewer();
  }
});

/* ========================================
   キーボード操作
======================================== */

document.addEventListener("keydown", (event) => {
  /* ポップアップが閉じている場合は何もしない */
  if (!viewer.classList.contains("is-open")) {
    return;
  }

  /* Escapeキーで閉じる */
  if (event.key === "Escape") {
    closeViewer();
  }

  /* 左矢印キーで前の画像 */
  if (event.key === "ArrowLeft") {
    showDetailImage(currentIndex - 1);
  }

  /* 右矢印キーで次の画像 */
  if (event.key === "ArrowRight") {
    showDetailImage(currentIndex + 1);
  }
});

/* ========================================
   スマートフォン用ナビゲーション
======================================== */

const navButton = document.getElementById("nav");
const navMenu = document.getElementById("nav-inner");

if (navButton && navMenu) {
  /* メニューの開閉 */
  function toggleNav() {
    const isOpen = navMenu.classList.toggle("is-open");

    navButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    navButton.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く"
    );
  }

  navButton.addEventListener("click", toggleNav);

  /* メニュー選択後に閉じる */
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");

      navButton.setAttribute("aria-expanded", "false");

      navButton.setAttribute(
        "aria-label",
        "メニューを開く"
      );
    });
  });
}

/* ========================================
   トップへ戻るボタン
======================================== */

const topButton = document.getElementById("top-btn");

if (topButton) {
  /* スクロール位置に応じて表示 */
  function updateTopButton() {
    topButton.classList.toggle(
      "is-visible",
      window.scrollY > 300
    );
  }

  window.addEventListener(
    "scroll",
    updateTopButton,
    { passive: true }
  );

  updateTopButton();
}


/* お問い合わせフォームの送信処理 */
(() => {
  const form = document.querySelector("#contact-form");
  const modal = document.querySelector("#form-modal");
  const closeButton = document.querySelector("#form-modal-close");
  const status = document.querySelector("#form-status");

  if (!form || !modal || !closeButton || !status) return;

  const submitButton = form.querySelector('button[type="submit"]');
  let sending = false;
  let sent = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (sending || sent) return;

    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "送信しています…";
    status.textContent = "送信しています。しばらくお待ちください。";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      // 入力欄を空にする
      form.reset();

      // このページでは再送信できないようにする
      sent = true;
      form.querySelectorAll("input, textarea, button").forEach((element) => {
        element.disabled = true;
      });

      status.textContent = "";
      modal.hidden = false;
      closeButton.focus();

    } catch (error) {
      status.textContent =
        "送信できませんでした。通信環境を確認して、もう一度お試しください。";

      submitButton.disabled = false;
      submitButton.textContent = "送信";

    } finally {
      sending = false;
    }
  });

  // ウィンドウを閉じる。フォームは再び有効にしない
  closeButton.addEventListener("click", () => {
    modal.hidden = true;
    submitButton.focus();
  });
})();
