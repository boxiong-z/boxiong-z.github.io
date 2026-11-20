(function () {
  "use strict";

  const assets = Array.isArray(window.TIKTOK_PAY_ASSETS) ? window.TIKTOK_PAY_ASSETS : [];
  const validRoutes = new Set(["home", "logo", "color", "typography", "assets"]);
  const routeTitles = {
    home: "TikTok Pay — Brand Assets",
    logo: "Logo — TikTok Pay Brand Assets",
    color: "Color — TikTok Pay Brand Assets",
    typography: "Typography — TikTok Pay Brand Assets",
    assets: "Visual Assets — TikTok Pay Brand Assets",
  };
  const defaultLogoBrand = "tiktok-pay";
  const logoBrands = new Map([
    ["tiktok-pay", {
      name: "TikTok Pay",
      resourceSrc: "./assets/brand/logo-system/tiktok-pay.svg",
      primarySrc: "./assets/brand/tiktok-pay-logo-white.svg",
      primaryAlt: "TikTok Pay primary white logo",
      stageTheme: "dark",
      stageMeta: "White · SVG",
      hasClearSpace: true,
      intro: "As our most recognizable brand element, the TikTok Pay logo pairs precise, machine-like construction with the finesse of a human touch. Its formal qualities keep our technology focused on people.",
      supportCopy: "Use the horizontal lockup wherever space allows. This supplied white master is ready for dark surfaces; preserve its proportions and original artwork.",
    }],
    ["tiktok-paylater", {
      name: "TikTok PayLater",
      resourceSrc: "./assets/brand/logo-system/tiktok-paylater.svg",
      primarySrc: "./assets/brand/logo-system/tiktok-paylater.svg",
      primaryAlt: "TikTok PayLater logo",
      stageTheme: "light",
      stageMeta: "Black · SVG",
      hasClearSpace: false,
      intro: "The TikTok PayLater lockup extends the TikTok Pay family with a clear, confident product identity. Keep the supplied master consistent and unobstructed.",
      supportCopy: "Use the supplied horizontal lockup wherever space allows. Preserve its proportions, surrounding space and original artwork.",
    }],
    ["tiktok-creator-card", {
      name: "TikTok Creator Card",
      resourceSrc: "./assets/brand/logo-system/tiktok-creator-card.svg",
      primarySrc: "./assets/brand/logo-system/tiktok-creator-card.svg",
      primaryAlt: "TikTok Creator Card logo",
      stageTheme: "light",
      stageMeta: "Black · SVG",
      hasClearSpace: false,
      intro: "The TikTok Creator Card lockup brings the creator product into the TikTok Pay family with a direct, recognizable identity. Keep the supplied master consistent and unobstructed.",
      supportCopy: "Use the supplied horizontal lockup wherever space allows. Preserve its proportions, surrounding space and original artwork.",
    }],
    ["tiktok-business-financing", {
      name: "TikTok Business Financing",
      resourceSrc: "./assets/brand/logo-system/tiktok-business-financing.svg",
      primarySrc: "./assets/brand/logo-system/tiktok-business-financing.svg",
      primaryAlt: "TikTok Business Financing logo",
      stageTheme: "light",
      stageMeta: "Black · SVG",
      hasClearSpace: false,
      intro: "The TikTok Business Financing lockup anchors the business brand family with a clear, practical identity. Keep the supplied master consistent and unobstructed.",
      supportCopy: "Use the supplied horizontal lockup wherever space allows. Preserve its proportions, surrounding space and original artwork.",
    }],
    ["trustfinancing", {
      name: "TrustFinancing",
      resourceSrc: "./assets/brand/logo-system/trustfinancing.svg",
      primarySrc: "./assets/brand/logo-system/trustfinancing.svg",
      primaryAlt: "TrustFinancing logo",
      stageTheme: "light",
      stageMeta: "Black · SVG",
      hasClearSpace: false,
      intro: "TrustFinancing is a focused sub-brand within the TikTok Business Financing family. Keep the supplied master consistent, clear and unobstructed.",
      supportCopy: "Use the supplied horizontal lockup wherever space allows. Preserve its proportions, surrounding space and original artwork.",
    }],
    ["early-settlement", {
      name: "Early Settlement",
      resourceSrc: "./assets/brand/logo-system/early-settlement.svg",
      primarySrc: "./assets/brand/logo-system/early-settlement.svg",
      primaryAlt: "Early Settlement logo",
      stageTheme: "light",
      stageMeta: "Black · SVG",
      hasClearSpace: false,
      intro: "Early Settlement is a focused sub-brand within the TikTok Business Financing family. Keep the supplied master consistent, clear and unobstructed.",
      supportCopy: "Use the supplied horizontal lockup wherever space allows. Preserve its proportions, surrounding space and original artwork.",
    }],
  ]);

  const assetGrid = document.getElementById("assetGrid");
  const assetFilters = document.getElementById("assetFilters");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  const canvasFisheyeToggle = document.getElementById("canvasFisheyeToggle");
  const homeViewToggle = document.getElementById("homeViewToggle");
  const homePage = document.querySelector('[data-page="home"]');
  const assetCanvasViewport = document.getElementById("assetCanvasViewport");
  const assetCanvasStage = document.getElementById("assetCanvasStage");
  const assetCanvasWorld = document.getElementById("assetCanvasWorld");
  const canvasFocusCaption = document.getElementById("canvasFocusCaption");
  const canvasFocusName = document.getElementById("canvasFocusName");
  const canvasFocusCategory = document.getElementById("canvasFocusCategory");
  const categoryTitle = document.getElementById("category-title");
  const toast = document.getElementById("toast");
  const assetDialog = document.getElementById("assetDialog");
  const lockedDialog = document.getElementById("lockedDialog");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const canvasFisheyeStorageKey = "tiktok-pay-canvas-fisheye-v2";

  let activeCategory = "All";
  let toastTimer;
  let previewList = assets;
  let previewPosition = 0;
  let assetDialogInvoker = null;
  let assetDialogScrollPosition = { x: 0, y: 0 };
  let assetDialogMotion = null;
  let assetDialogMotionState = "closed";
  let assetDialogImageRequest = 0;
  let lockedDialogInvoker = null;
  let lockedDialogScrollPosition = { x: 0, y: 0 };
  let collapseLogoBusinessShowcase = () => {};
  let collapseLogoJumpDock = () => {};
  let collapseDetailRouteDocks = () => {};
  let resetLogoJumpDock = () => {};
  let syncColorSpectrumStoryRoute = () => {};
  let syncDetailRouteDock = () => {};
  let syncTypographyExperienceRoute = () => {};

  function assetUrl(file) {
    return new URL(`./visual-assets/${encodeURIComponent(file)}`, document.baseURI).href;
  }

  function previewUrl(file, size = 256) {
    return new URL(`./previews/${size}/${encodeURIComponent(file.replace(/\.png$/, ".webp"))}`, document.baseURI).href;
  }

  function setCanvasPreview(image, file) {
    image.srcset = `${previewUrl(file, 512)} 2x`;
    image.src = previewUrl(file);
  }

  // Observe transformed image bounds so only visible artwork is decoded and painted.
  // Visibility does not change those bounds, so panning back reactivates the same nodes.
  const canvasImageObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const image = entry.target;
      image.style.visibility = entry.isIntersecting ? "visible" : "hidden";
      if (entry.isIntersecting && !image.hasAttribute("src")) {
        setCanvasPreview(image, image.dataset.assetFile);
      }
    }
  }, { root: assetCanvasViewport });

  const defaultAssetMetric = { scale: 1, x: 0, y: 0 };
  const assetVisualMetrics = new Map([
    ["cash-advance-parcel.png", { scale: 1.225, x: -3.13, y: 0.75 }],
    ["paylater-trophy.png", { scale: 1.234, x: -2.33, y: 0.21 }],
    ["safe-payments-wallet.png", { scale: 1.219, x: 0.54, y: 0.14 }],
    ["mint-like-badge.png", { scale: 1.030, x: -0.62, y: -0.94 }],
    ["payment-calculator.png", { scale: 1.045, x: -2.21, y: -1.38 }],
    ["tiktok-notification-bell.png", { scale: 1.273, x: -2.66, y: 0.68 }],
    ["creator-card-gummy-bear.png", { scale: 1.980, x: 1.06, y: 1.86 }],
    ["pink-upload-bubble.png", { scale: 0.997, x: 2.29, y: 0.50 }],
    ["discount-work-glove.png", { scale: 1.246, x: -2.16, y: 0.82 }],
    ["cyan-tiktok-coin.png", { scale: 1.236, x: 3.80, y: -0.92 }],
    ["upright-gold-tiktok-coin.png", { scale: 1.300, x: -0.35, y: -0.70 }],
    ["lime-tiktok-coin.png", { scale: 1.528, x: 1.61, y: -2.64 }],
    ["mint-pixel-smile-coin.png", { scale: 1.071, x: -0.11, y: -0.23 }],
    ["gold-dollar-coin.png", { scale: 0.845, x: 1.95, y: -3.57 }],
    ["orange-tiktok-parcel-box.png", { scale: 0.820, x: -0.07, y: 0 }],
    ["rose-gold-tiktok-coin.png", { scale: 0.944, x: 0.11, y: 2.16 }],
    ["zero-dollar-paylater-calendar.png", { scale: 0.883, x: -0.38, y: 1.51 }],
    ["pink-glass-asterisk.png", { scale: 1.173, x: -0.20, y: 3.41 }],
    ["periwinkle-spiral-orb.png", { scale: 0.820, x: 0.24, y: 0 }],
    ["pink-up-right-arrow.png", { scale: 0.820, x: 0.09, y: -0.18 }],
    ["lavender-verified-token.png", { scale: 1.099, x: 1.04, y: -2.74 }],
    ["silver-peso-symbol.png", { scale: 1.323, x: -5.15, y: -0.70 }],
    ["pink-fingerprint-token.png", { scale: 0.823, x: -1.54, y: 0.41 }],
    ["brazilian-real-pebble.png", { scale: 0.973, x: 1.30, y: -3.69 }],
    ["pay-coin-stack.png", { scale: 0.913, x: -0.20, y: -1.86 }],
    ["pay-parcel-box.png", { scale: 0.864, x: 0.86, y: -0.52 }],
    ["silver-tiktok-note.png", { scale: 1.458, x: -2.02, y: -1.12 }],
    ["magenta-pixel-smile-coin.png", { scale: 0.920, x: -1.20, y: 1.90 }],
    ["tiktok-pay-logo-cushion.png", { scale: 0.966, x: 1.49, y: 1.76 }],
    ["lavender-smiley-badge.png", { scale: 1.007, x: 1.34, y: 0 }],
    ["purple-discount-tag.png", { scale: 1.537, x: -1.76, y: -0.49 }],
    ["identity-security-vault.png", { scale: 1.167, x: 2.67, y: -1.29 }],
    ["mint-moon-and-star-badge.png", { scale: 1.142, x: -2.64, y: -2.54 }],
    ["pink-eight-point-badge.png", { scale: 1.164, x: -1.27, y: 2.06 }],
    ["cyan-hexagon-badge.png", { scale: 1.416, x: -0.30, y: 0 }],
    ["security-alert-device.png", { scale: 1.048, x: 2.42, y: -1.42 }],
    ["pink-four-point-sparkle.png", { scale: 1.416, x: 4, y: 0.21 }],
    ["blue-glass-flower.png", { scale: 1.342, x: 1.75, y: -1.46 }],
    ["cool-palette-ring.png", { scale: 0.942, x: -0.61, y: 0.20 }],
    ["citrus-palette-ring.png", { scale: 1.063, x: -2.11, y: 1.21 }],
    ["blush-palette-ring.png", { scale: 0.965, x: 2.34, y: -0.61 }],
    ["cyan-tiktok-padlock.png", { scale: 1.008, x: 1.56, y: 0.47 }],
    ["angled-gold-tiktok-coin.png", { scale: 0.904, x: 0.22, y: 0.67 }],
    ["pink-percent-symbol.png", { scale: 1.120, x: 5.80, y: 1.29 }],
    ["cyan-clock.png", { scale: 1.175, x: 0.36, y: -3.09 }],
    ["orange-flame.png", { scale: 1.300, x: -2.69, y: 0.37 }],
    ["tiktok-shield-tag.png", { scale: 1.186, x: -3.80, y: -1.71 }],
    ["light-pink-pixel-smile-coin.png", { scale: 1.130, x: 3.32, y: -1.44 }],
    ["low-angle-gold-tiktok-coin.png", { scale: 1.036, x: -1.30, y: -1.85 }],
    ["cyan-pixel-smile-coin.png", { scale: 1.129, x: 0.11, y: 1.56 }],
    ["red-pound-symbol.png", { scale: 0.936, x: 0.61, y: -1.58 }],
    ["silver-navigation-pointer.png", { scale: 1.335, x: 5.62, y: 2.36 }],
    ["cyan-up-arrow.png", { scale: 1.608, x: 0.52, y: 2.20 }],
    ["cyan-checkmark-cushion.png", { scale: 1.012, x: -4.89, y: -2.95 }],
    ["pink-dollar-coin.png", { scale: 0.970, x: -1.47, y: 0.45 }],
    ["cyan-checkmark-token.png", { scale: 1.392, x: -2.32, y: -1.66 }],
    ["mixed-coin-stack.png", { scale: 1.119, x: 0.66, y: 3.20 }],
    ["tiktok-wallet-with-coins.png", { scale: 1.073, x: 2.94, y: 1.72 }],
    ["paylater-wallet-with-clock.png", { scale: 1.204, x: 1.85, y: 5.56 }],
    ["pink-checkmark-cushion.png", { scale: 1.266, x: -1.07, y: -2.39 }],
    ["silver-tiktok-shield.png", { scale: 1.284, x: 2.57, y: -2.86 }],
    ["mint-lightning-bolt.png", { scale: 0.931, x: 3.77, y: -1.39 }],
    ["pink-percent-cushion.png", { scale: 1.009, x: 1.31, y: -1.97 }],
    ["pink-six-petal-spark.png", { scale: 0.994, x: 8.07, y: -0.61 }],
    ["silver-puff-cushion.png", { scale: 1.019, x: -0.20, y: -1.43 }],
    ["pink-tiktok-shopping-bag.png", { scale: 1.157, x: 2.13, y: 0.69 }],
  ]);

  // Sampled once from each transparent source PNG so card lighting stays stable on file:// and HTTP.
  const assetAccentColors = new Map([
    ["cash-advance-parcel.png", [238, 216, 184]],
    ["paylater-trophy.png", [199, 83, 93]],
    ["safe-payments-wallet.png", [16, 170, 183]],
    ["mint-like-badge.png", [59, 201, 159]],
    ["payment-calculator.png", [200, 69, 85]],
    ["tiktok-notification-bell.png", [116, 124, 135]],
    ["creator-card-gummy-bear.png", [239, 136, 51]],
    ["pink-upload-bubble.png", [239, 155, 209]],
    ["discount-work-glove.png", [24, 230, 234]],
    ["cyan-tiktok-coin.png", [118, 241, 243]],
    ["upright-gold-tiktok-coin.png", [221, 167, 71]],
    ["lime-tiktok-coin.png", [227, 253, 114]],
    ["mint-pixel-smile-coin.png", [120, 208, 189]],
    ["gold-dollar-coin.png", [220, 173, 90]],
    ["orange-tiktok-parcel-box.png", [255, 171, 33]],
    ["rose-gold-tiktok-coin.png", [208, 169, 146]],
    ["zero-dollar-paylater-calendar.png", [232, 70, 99]],
    ["pink-glass-asterisk.png", [249, 203, 219]],
    ["periwinkle-spiral-orb.png", [183, 196, 244]],
    ["pink-up-right-arrow.png", [254, 161, 216]],
    ["lavender-verified-token.png", [214, 186, 252]],
    ["silver-peso-symbol.png", [145, 145, 145]],
    ["pink-fingerprint-token.png", [242, 169, 215]],
    ["brazilian-real-pebble.png", [200, 194, 186]],
    ["pay-coin-stack.png", [209, 160, 75]],
    ["pay-parcel-box.png", [250, 208, 147]],
    ["silver-tiktok-note.png", [184, 179, 183]],
    ["magenta-pixel-smile-coin.png", [247, 162, 217]],
    ["tiktok-pay-logo-cushion.png", [185, 183, 184]],
    ["lavender-smiley-badge.png", [200, 161, 202]],
    ["purple-discount-tag.png", [138, 136, 243]],
    ["identity-security-vault.png", [119, 118, 129]],
    ["mint-moon-and-star-badge.png", [56, 227, 177]],
    ["pink-eight-point-badge.png", [251, 172, 221]],
    ["cyan-hexagon-badge.png", [136, 244, 250]],
    ["security-alert-device.png", [45, 51, 61]],
    ["pink-four-point-sparkle.png", [236, 159, 233]],
    ["blue-glass-flower.png", [86, 209, 238]],
    ["cool-palette-ring.png", [81, 180, 238]],
    ["citrus-palette-ring.png", [246, 225, 71]],
    ["blush-palette-ring.png", [228, 115, 147]],
    ["cyan-tiktok-padlock.png", [10, 208, 225]],
    ["angled-gold-tiktok-coin.png", [242, 191, 86]],
    ["pink-percent-symbol.png", [246, 143, 218]],
    ["cyan-clock.png", [8, 235, 243]],
    ["orange-flame.png", [255, 168, 50]],
    ["tiktok-shield-tag.png", [153, 157, 173]],
    ["light-pink-pixel-smile-coin.png", [255, 201, 249]],
    ["low-angle-gold-tiktok-coin.png", [249, 198, 94]],
    ["cyan-pixel-smile-coin.png", [154, 244, 248]],
    ["red-pound-symbol.png", [235, 77, 105]],
    ["silver-navigation-pointer.png", [163, 169, 192]],
    ["cyan-up-arrow.png", [98, 224, 244]],
    ["cyan-checkmark-cushion.png", [80, 206, 212]],
    ["pink-dollar-coin.png", [236, 141, 192]],
    ["cyan-checkmark-token.png", [62, 208, 223]],
    ["mixed-coin-stack.png", [243, 198, 112]],
    ["tiktok-wallet-with-coins.png", [99, 103, 117]],
    ["paylater-wallet-with-clock.png", [4, 163, 196]],
    ["pink-checkmark-cushion.png", [237, 123, 174]],
    ["silver-tiktok-shield.png", [177, 186, 206]],
    ["mint-lightning-bolt.png", [87, 245, 214]],
    ["pink-percent-cushion.png", [250, 173, 220]],
    ["pink-six-petal-spark.png", [255, 171, 240]],
    ["silver-puff-cushion.png", [195, 194, 206]],
    ["pink-tiktok-shopping-bag.png", [249, 96, 154]],
  ]);

  function getAssetAccent(asset) {
    return assetAccentColors.get(asset.file) || [45, 204, 211];
  }

  function getHashSegments() {
    return window.location.hash
      .replace(/^#\/?/, "")
      .trim()
      .toLowerCase()
      .split("/")
      .filter(Boolean);
  }

  function getRouteFromHash() {
    const [route = ""] = getHashSegments();
    return validRoutes.has(route) ? route : "home";
  }

  function normalizeLogoBrand(brandSlug) {
    const normalized = typeof brandSlug === "string"
      ? brandSlug.trim().toLowerCase()
      : "";
    return logoBrands.has(normalized) ? normalized : defaultLogoBrand;
  }

  function getLogoBrandFromHash() {
    const [route = "", brandSlug = ""] = getHashSegments();
    return route === "logo" ? normalizeLogoBrand(brandSlug) : defaultLogoBrand;
  }

  function renderLogoBrand(brandSlug) {
    const normalizedBrand = normalizeLogoBrand(brandSlug);
    const brand = logoBrands.get(normalizedBrand);
    if (!brand) return defaultLogoBrand;

    document.body.dataset.logoBrand = normalizedBrand;

    const intro = document.querySelector("[data-logo-intro]");
    const stage = document.querySelector("[data-logo-stage]");
    const primaryImage = document.querySelector("[data-logo-primary-image]");
    const stageMeta = document.querySelector("[data-logo-stage-meta]");
    const stageDownload = document.querySelector("[data-logo-stage-download]");
    const supportCopy = document.querySelector("[data-logo-support-copy]");
    const clearSpaceSection = document.querySelector("[data-logo-clearspace-section]");
    const clearSpaceNav = document.querySelector("[data-logo-clearspace-nav]");
    const resourceDownload = document.querySelector("[data-logo-resource-download]");
    const resourceImage = document.querySelector("[data-logo-resource-image]");
    const resourceTitle = document.querySelector("[data-logo-resource-title]");
    const resourceCopy = document.querySelector("[data-logo-resource-copy]");
    const resourceFileName = brand.resourceSrc.split("/").pop() || `${normalizedBrand}.svg`;
    const primaryFileName = brand.primarySrc.split("/").pop() || resourceFileName;

    if (intro) intro.textContent = brand.intro;
    if (stage) stage.dataset.logoStageTheme = brand.stageTheme;
    if (primaryImage) {
      primaryImage.src = brand.primarySrc;
      primaryImage.alt = brand.primaryAlt;
    }
    if (stageMeta) stageMeta.textContent = brand.stageMeta;
    if (stageDownload) {
      stageDownload.href = brand.primarySrc;
      stageDownload.download = primaryFileName;
      stageDownload.setAttribute("aria-label", `Download the ${brand.name} SVG`);
    }
    if (supportCopy) supportCopy.textContent = brand.supportCopy;
    if (clearSpaceSection) clearSpaceSection.hidden = !brand.hasClearSpace;
    if (clearSpaceNav) clearSpaceNav.hidden = !brand.hasClearSpace;
    if (resourceDownload) {
      resourceDownload.href = brand.resourceSrc;
      resourceDownload.download = resourceFileName;
      resourceDownload.setAttribute("aria-label", `Download the ${brand.name} master SVG`);
    }
    if (resourceImage) {
      resourceImage.src = brand.resourceSrc;
      resourceImage.alt = `${brand.name} logo`;
    }
    if (resourceTitle) resourceTitle.textContent = `${brand.name} logo`;
    if (resourceCopy) resourceCopy.textContent = `Download the ${brand.name} master SVG.`;

    document.querySelectorAll(".logo-local-nav [data-logo-brand]").forEach((trigger) => {
      const isCurrent = trigger.dataset.logoBrand === normalizedBrand;
      trigger.classList.toggle("is-active", isCurrent);
      if (isCurrent) trigger.setAttribute("aria-current", "page");
      else trigger.removeAttribute("aria-current");
    });

    return normalizedBrand;
  }

  function focusBentoEntry() {
    window.requestAnimationFrame(() => {
      if (document.body.dataset.route !== "home"
        || document.body.dataset.homeMode !== "bento") return;
      categoryTitle?.focus({ preventScroll: true });
    });
  }

  function resetLogoSectionNav() {
    const localLinks = [...document.querySelectorAll(".logo-local-link[data-scroll-target]")];
    localLinks.forEach((link, index) => {
      const isFirst = index === 0;
      link.classList.toggle("is-active", isFirst);
      if (isFirst) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const localNav = document.querySelector(".logo-local-nav");
    if (localNav) localNav.scrollLeft = 0;
  }

  function navigate(route, updateHistory = true, requestedHomeMode = "", requestedLogoBrand = "") {
    const nextRoute = validRoutes.has(route) ? route : "home";
    const previousRoute = document.body.dataset.route || "";
    const previousHomeMode = document.body.dataset.homeMode || "";
    const nextLogoBrand = nextRoute === "logo"
      ? renderLogoBrand(requestedLogoBrand || defaultLogoBrand)
      : defaultLogoBrand;

    if (updateHistory && previousRoute === "home" && nextRoute !== "home") {
      window.history.replaceState({
        ...(window.history.state || {}),
        route: "home",
        homeMode: previousHomeMode === "bento" ? "bento" : "canvas",
        logoBrand: "",
      }, "", window.location.pathname);
    }

    if (nextRoute !== "logo") {
      collapseLogoBusinessShowcase();
      collapseLogoJumpDock();
    }
    collapseDetailRouteDocks();

    if (nextRoute !== "home") {
      if (canvasFocusedPosition !== null) clearCanvasFocus(false);
      cancelCanvasInertia();
      cancelCanvasGesture();
    }

    document.querySelectorAll(".page").forEach((page) => {
      page.classList.toggle("is-active", page.dataset.page === nextRoute);
    });

    document.querySelectorAll(".route-trigger, .rail-item, .nav-item").forEach((trigger) => {
      const triggerLogoBrand = trigger.dataset.logoBrand || "";
      const isCurrent = trigger.dataset.route === nextRoute
        && (nextRoute !== "logo" || !triggerLogoBrand || triggerLogoBrand === nextLogoBrand);
      trigger.classList.toggle("is-current", isCurrent);
      if (trigger.classList.contains("nav-item")) {
        trigger.setAttribute("aria-current", isCurrent ? "page" : "false");
      }
      if (triggerLogoBrand && !trigger.closest(".logo-local-nav")) {
        if (isCurrent) trigger.setAttribute("aria-current", "page");
        else trigger.removeAttribute("aria-current");
      }
    });

    document.body.dataset.route = nextRoute;
    if (nextRoute !== "logo") delete document.body.dataset.logoBrand;
    if (nextRoute !== "home") delete document.body.dataset.homeMode;
    if (nextRoute !== "home") {
      resetCanvasParallax(true);
      cancelCanvasGesture();
    }
    syncCanvasFisheyeState();
    syncCanvasActivity();
    document.title = nextRoute === "logo"
      ? `${logoBrands.get(nextLogoBrand).name} Logo — TikTok Pay Brand Assets`
      : routeTitles[nextRoute];
    if (nextRoute === "home" && updateHistory) {
      setHomeMode(requestedHomeMode === "bento" ? "bento" : "canvas");
    }

    if (updateHistory) {
      const routeHash = nextRoute === "logo" ? `logo/${nextLogoBrand}` : nextRoute;
      const nextHash = nextRoute === "home" ? window.location.pathname : `${window.location.pathname}#${routeHash}`;
      window.history.pushState({
        route: nextRoute,
        homeMode: nextRoute === "home" ? (requestedHomeMode === "bento" ? "bento" : "canvas") : "",
        logoBrand: nextRoute === "logo" ? nextLogoBrand : "",
      }, "", nextHash);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    if (nextRoute === "logo") {
      resetLogoSectionNav();
      resetLogoJumpDock();
    }
    window.requestAnimationFrame(() => {
      syncDetailRouteDock(nextRoute);
      syncColorSpectrumStoryRoute(nextRoute);
      syncTypographyExperienceRoute(nextRoute);
    });
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  async function copyText(text, confirmation) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_error) {
      const fallback = document.createElement("textarea");
      fallback.value = text;
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }
    showToast(confirmation || `Copied ${text}`);
  }

  function restoreLockedDialogScroll() {
    if (Math.abs(window.scrollY - lockedDialogScrollPosition.y) > 1
      || Math.abs(window.scrollX - lockedDialogScrollPosition.x) > 1) {
      window.scrollTo({
        top: lockedDialogScrollPosition.y,
        left: lockedDialogScrollPosition.x,
        behavior: "instant",
      });
    }
  }

  function lockLockedDialogBackground() {
    document.body.style.setProperty(
      "--locked-dialog-scroll-offset",
      `${-lockedDialogScrollPosition.y}px`,
    );
    document.body.classList.add("is-locked-dialog-open");
  }

  function unlockLockedDialogBackground() {
    document.body.classList.remove("is-locked-dialog-open");
    document.body.style.removeProperty("--locked-dialog-scroll-offset");
    restoreLockedDialogScroll();
  }

  function openLockedDialog(sectionName, invoker = document.activeElement) {
    const title = document.getElementById("lockedTitle");
    const description = document.getElementById("lockedDescription");
    const descriptions = {
      Motion: "This chapter will open when the motion principles, logo movement and production files are ready.",
      Voice: "This chapter will open when the voice principles, message patterns and localization guidance are ready.",
      "Our Brand": "This brand introduction will open when its story, positioning and design system are ready.",
    };
    lockedDialog.dataset.section = sectionName.toLowerCase().replace(/\s+/g, "-");
    title.textContent = `${sectionName} is in development.`;
    description.textContent = descriptions[sectionName]
      || "This chapter will open when its foundation and production library are ready.";
    lockedDialogInvoker = invoker instanceof HTMLElement ? invoker : null;
    lockedDialogScrollPosition = { x: window.scrollX, y: window.scrollY };
    lockLockedDialogBackground();
    lockedDialog.showModal();
    lockedDialog.querySelector("[data-close-locked]")?.focus({ preventScroll: true });
  }

  const canvasLeadFiles = [
    "orange-tiktok-parcel-box.png", "periwinkle-spiral-orb.png", "pink-fingerprint-token.png", "gold-dollar-coin.png", "pay-parcel-box.png", "pink-up-right-arrow.png",
    "cyan-tiktok-padlock.png", "zero-dollar-paylater-calendar.png", "tiktok-wallet-with-coins.png", "lavender-smiley-badge.png", "pay-coin-stack.png", "security-alert-device.png",
    "pink-percent-cushion.png", "cyan-checkmark-cushion.png", "orange-flame.png", "cyan-pixel-smile-coin.png", "pink-glass-asterisk.png", "tiktok-notification-bell.png",
    "payment-calculator.png", "pink-tiktok-shopping-bag.png", "cool-palette-ring.png", "pink-dollar-coin.png", "mint-moon-and-star-badge.png", "tiktok-pay-logo-cushion.png",
  ];

  let canvasAssets = [];
  let canvasAssetElements = [];
  let canvasAssetStates = [];
  let canvasX = 0;
  let canvasY = 0;
  let canvasScale = 0.72;
  let canvasHasPosition = false;
  let canvasFocusedPosition = null;
  let canvasCameraBeforeFocus = null;
  let canvasFocusReturnElement = null;
  let canvasCameraAnimation = null;
  let prototypeHostActive = true;
  const portalActivities = new Map();
  const portalActivityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const activity = portalActivities.get(entry.target);
      if (activity) activity.intersects = entry.isIntersecting;
    });
    syncPortalActivity();
  });

  function watchPortalActivity(element, onChange = () => {}) {
    if (!element) return;
    portalActivities.set(element, { intersects: false, active: false, onChange });
    element.style.setProperty("--portal-motion-state", "paused");
    portalActivityObserver.observe(element);
  }

  function syncPortalActivity() {
    const hostActive = prototypeHostActive && !document.hidden
      && document.body.dataset.route === "home"
      && document.body.dataset.homeMode === "bento";
    portalActivities.forEach((activity, element) => {
      const active = hostActive && activity.intersects;
      if (active === activity.active) return;
      activity.active = active;
      // CSS play-state preserves each animation's current time, including its
      // negative delay. Existing hover/focus pause rules retain precedence.
      element.style.setProperty("--portal-motion-state", active ? "running" : "paused");
      activity.onChange(active);
    });
  }
  let canvasRenderFrame = 0;
  let canvasRenderLastTime = 0;
  let canvasRenderDirty = false;
  let canvasForceWrapRender = false;
  let canvasViewportWidth = 0;
  let canvasViewportHeight = 0;
  let canvasFisheyeStyle = null;
  let canvasFisheyeRules = [];
  let canvasFisheyeRuleTransforms = [];
  let canvasLayoutKey = "";
  let suppressCanvasClickUntil = 0;
  let canvasInertia = null;
  let canvasWheelTrailTimer = 0;
  let canvasTrailNear = null;
  let canvasTrailFar = null;
  let canvasTrailNearAssets = [];
  let canvasTrailFarAssets = [];
  let canvasRenderX = 0;
  let canvasRenderY = 0;
  let canvasWrapSuspended = false;
  let canvasWrapResumeTimer = 0;
  let canvasFisheyeSuspended = false;
  let canvasFisheyeEnabled = true;
  let canvasFisheyeStrength = 1;
  let canvasFisheyeTargetStrength = 1;
  let canvasParallaxCurrentX = 0;
  let canvasParallaxCurrentY = 0;
  let canvasParallaxTargetX = 0;
  let canvasParallaxTargetY = 0;
  let canvasLongPressTimer = 0;
  let focusAnimations = [];
  const activeCanvasPointers = new Map();
  let canvasPinch = null;
  let canvasGestureHadPinch = false;

  const canvasDrag = {
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
    targetAsset: null,
  };

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function smoothstep(minimum, maximum, value) {
    const amount = clamp((value - minimum) / Math.max(maximum - minimum, 0.0001), 0, 1);
    return amount * amount * (3 - 2 * amount);
  }

  try {
    const savedFisheye = window.localStorage.getItem(canvasFisheyeStorageKey);
    if (savedFisheye !== null) canvasFisheyeEnabled = savedFisheye !== "false";
  } catch (_error) {
    // The local file demo may run with storage disabled. Default to the requested lens view.
  }
  canvasFisheyeStrength = canvasFisheyeEnabled ? 1 : 0;
  canvasFisheyeTargetStrength = canvasFisheyeStrength;

  function canvasFisheyeShouldBeActive() {
    return canvasFisheyeEnabled
      && !canvasFisheyeSuspended
      && canvasFocusedPosition === null
      && !homePage.classList.contains("is-bento")
      && (!document.body.dataset.route || document.body.dataset.route === "home");
  }

  function syncCanvasFisheyeState(immediate = false) {
    homePage.classList.toggle("has-fisheye", canvasFisheyeEnabled);
    homePage.classList.toggle("is-fisheye-suspended", canvasFisheyeSuspended);
    canvasFisheyeTargetStrength = canvasFisheyeShouldBeActive() ? 1 : 0;
    if (immediate || reduceMotionQuery.matches) canvasFisheyeStrength = canvasFisheyeTargetStrength;
    requestCanvasRender();
  }

  function suspendCanvasFisheye() {
    canvasFisheyeSuspended = true;
    resetCanvasParallax(true);
    syncCanvasFisheyeState(true);
  }

  function resumeCanvasFisheye() {
    canvasFisheyeSuspended = false;
    syncCanvasFisheyeState();
  }

  function setCanvasFisheye(enabled, persist = true) {
    canvasFisheyeEnabled = Boolean(enabled);
    canvasFisheyeToggle?.setAttribute("aria-checked", String(canvasFisheyeEnabled));
    if (persist) {
      try {
        window.localStorage.setItem(canvasFisheyeStorageKey, String(canvasFisheyeEnabled));
      } catch (_error) {
        // Keep the switch functional even when local storage is unavailable.
      }
    }
    if (!canvasFisheyeEnabled) resetCanvasParallax(true);
    syncCanvasFisheyeState();
  }

  function syncCanvasParallaxVariables() {
    requestCanvasRender();
  }

  function setCanvasParallaxTarget(x, y) {
    canvasParallaxTargetX = x;
    canvasParallaxTargetY = y;
    if (reduceMotionQuery.matches) {
      canvasParallaxCurrentX = x;
      canvasParallaxCurrentY = y;
      syncCanvasParallaxVariables();
      return;
    }
    requestCanvasRender();
  }

  function resetCanvasParallax(immediate = false) {
    canvasParallaxTargetX = 0;
    canvasParallaxTargetY = 0;
    if (immediate || reduceMotionQuery.matches) {
      canvasParallaxCurrentX = 0;
      canvasParallaxCurrentY = 0;
      syncCanvasParallaxVariables();
      return;
    }
    requestCanvasRender();
  }

  function buildCanvasFisheyeRules(count) {
    canvasFisheyeStyle?.remove();
    canvasFisheyeStyle = document.createElement("style");
    canvasFisheyeStyle.id = "canvas-fisheye-rules";
    canvasFisheyeStyle.textContent = Array.from({ length: count }, (_value, position) => (
      `#assetCanvasStage .canvas-asset[data-canvas-position="${position}"] > .canvas-asset-lens { transform: translate3d(0, 0, 0) scale(1); }`
    )).join("\n");
    document.head.appendChild(canvasFisheyeStyle);
    canvasFisheyeRules = [...canvasFisheyeStyle.sheet.cssRules];
    canvasFisheyeRuleTransforms = Array(count).fill("");
  }

  function updateCanvasFisheyeTransforms() {
    if (!canvasAssetStates.length || canvasFisheyeRules.length !== canvasAssetStates.length) return;
    const viewportWidth = canvasViewportWidth;
    const viewportHeight = canvasViewportHeight;
    if (!viewportWidth || !viewportHeight) return;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const strength = clamp(canvasFisheyeStrength, 0, 1);
    const projectionScale = lerp(1, 1.15, strength);

    canvasAssetStates.forEach((state, index) => {
      let shiftX = 0;
      let shiftY = 0;
      let lensScale = 1;

      if (strength > 0.0001) {
        const rawX = canvasRenderX + (canvasStateX(state) + state.size / 2) * canvasScale;
        const rawY = canvasRenderY + (canvasStateY(state) + state.size / 2) * canvasScale;
        const screenX = centerX + (rawX - centerX) * projectionScale + canvasParallaxCurrentX;
        const screenY = centerY + (rawY - centerY) * projectionScale + canvasParallaxCurrentY;
        const deltaX = screenX - centerX;
        const deltaY = screenY - centerY;
        const radius = Math.hypot(
          deltaX / Math.max(viewportWidth * 0.62, 1),
          deltaY / Math.max(viewportHeight * 0.72, 1),
        );
        const influence = 1 - smoothstep(0.08, 1.08, radius);
        const shapedInfluence = Math.pow(influence, 0.82);
        const radialPush = Math.pow(influence, 1.34) * 0.34 * strength;
        shiftX = deltaX * radialPush / Math.max(canvasScale, 0.001);
        shiftY = deltaY * radialPush / Math.max(canvasScale, 0.001);
        lensScale = lerp(1, lerp(0.84, 1.36, shapedInfluence), strength);
      }

      const transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) scale(${lensScale.toFixed(4)})`;
      if (canvasFisheyeRuleTransforms[index] === transform) return;
      canvasFisheyeRules[index].style.transform = transform;
      canvasFisheyeRuleTransforms[index] = transform;
    });
  }

  function updateCanvasParallaxFromPointer(event) {
    if (
      !finePointerQuery.matches
      || event.pointerType === "touch"
      || reduceMotionQuery.matches
      || !canvasFisheyeEnabled
      || canvasFisheyeSuspended
      || canvasDrag.active
      || canvasFocusedPosition !== null
      || homePage.classList.contains("is-bento")
    ) return;
    const rect = assetCanvasViewport.getBoundingClientRect();
    const normalizedX = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1, -1, 1);
    const normalizedY = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1, -1, 1);
    const shapeAxis = (value) => {
      const direction = Math.sign(value);
      return direction * smoothstep(0.06, 1, Math.abs(value));
    };
    const shapedX = shapeAxis(normalizedX);
    const shapedY = shapeAxis(normalizedY);
    const maximumShiftX = clamp(rect.width * 0.024, 22, 38);
    const maximumShiftY = clamp(rect.height * 0.026, 16, 26);
    // Deliberately mirror the horizontal axis: upper-left pointer → upper-right icon drift.
    setCanvasParallaxTarget(
      -shapedX * maximumShiftX,
      shapedY * maximumShiftY,
    );
  }

  function clearCanvasLongPress() {
    window.clearTimeout(canvasLongPressTimer);
    canvasLongPressTimer = 0;
  }

  function releaseCanvasPressFeedback() {
    clearCanvasLongPress();
    assetCanvasViewport.classList.remove("is-canvas-pressed", "is-dragging");
  }

  function scheduleCanvasLongPress(pointerId) {
    clearCanvasLongPress();
    canvasLongPressTimer = window.setTimeout(() => {
      canvasLongPressTimer = 0;
      if (
        canvasDrag.active
        && canvasDrag.pointerId === pointerId
        && !canvasDrag.moved
        && !canvasGestureHadPinch
        && canvasFocusedPosition === null
      ) {
        assetCanvasViewport.classList.add("is-canvas-pressed");
      }
    }, 260);
  }

  function cancelCanvasGesture() {
    clearCanvasLongPress();
    [...activeCanvasPointers.keys()].forEach((pointerId) => {
      if (assetCanvasViewport.hasPointerCapture(pointerId)) assetCanvasViewport.releasePointerCapture(pointerId);
    });
    activeCanvasPointers.clear();
    canvasPinch = null;
    canvasGestureHadPinch = false;
    canvasDrag.active = false;
    canvasDrag.moved = false;
    canvasDrag.pointerId = null;
    canvasDrag.velocityX = 0;
    canvasDrag.velocityY = 0;
    canvasDrag.targetAsset = null;
    assetCanvasViewport.classList.remove("is-camera-moving");
    releaseCanvasPressFeedback();
    updateCanvasTrail(0, 0);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function hashUnit(value) {
    return hashString(value) / 4294967295;
  }

  function getCanvasLayout() {
    const mobile = window.innerWidth < 700;
    return mobile
      ? { mobile, columns: 6, rows: 11, width: 1680, height: 3080, assetSize: 166 }
      : { mobile, columns: 11, rows: 6, width: 3520, height: 1920, assetSize: 208 };
  }

  function getCanvasScaleLimits() {
    const layout = getCanvasLayout();
    const wrapGuard = layout.mobile ? 96 : 156;
    const seamlessScale = Math.max(
      (canvasViewportWidth + wrapGuard * 2) / layout.width,
      (canvasViewportHeight + wrapGuard * 2) / layout.height,
    );
    return {
      minimum: seamlessScale,
      maximum: layout.mobile ? 1.45 : 1.7,
    };
  }

  function wrapCanvasCameraAxis(value, period) {
    if (!Number.isFinite(period) || period <= 0) return value;
    return value - Math.round(value / period) * period;
  }

  function canvasStateX(state) {
    return state.x + (state.wrapX || 0);
  }

  function canvasStateY(state) {
    return state.y + (state.wrapY || 0);
  }

  function setCanvasWrappedAssetPosition(element, state) {
    if (!element) return;
    element.style.left = `${canvasStateX(state)}px`;
    element.style.top = `${canvasStateY(state)}px`;
  }

  function updateCanvasAssetWraps(renderX = canvasRenderX, renderY = canvasRenderY, force = false) {
    if (canvasWrapSuspended || canvasFocusedPosition !== null || !canvasAssetStates.length) return;
    const layout = getCanvasLayout();
    const viewportCenterX = canvasViewportWidth / 2;
    const viewportCenterY = canvasViewportHeight / 2;
    canvasAssetStates.forEach((state, index) => {
      const baseScreenX = renderX + (state.x + state.size / 2) * canvasScale;
      const baseScreenY = renderY + (state.y + state.size / 2) * canvasScale;
      const nextWrapX = Math.round((viewportCenterX - baseScreenX) / (layout.width * canvasScale)) * layout.width;
      const nextWrapY = Math.round((viewportCenterY - baseScreenY) / (layout.height * canvasScale)) * layout.height;
      if (!force && state.wrapX === nextWrapX && state.wrapY === nextWrapY) return;
      state.wrapX = nextWrapX;
      state.wrapY = nextWrapY;
      setCanvasWrappedAssetPosition(canvasAssetElements[index], state);
      setCanvasWrappedAssetPosition(canvasTrailNearAssets[index], state);
      setCanvasWrappedAssetPosition(canvasTrailFarAssets[index], state);
    });
  }

  function syncCanvasViewportMetrics(width = assetCanvasViewport.clientWidth, height = assetCanvasViewport.clientHeight) {
    canvasViewportWidth = Math.max(0, width || 0);
    canvasViewportHeight = Math.max(0, height || 0);
  }

  function rebaseCanvasCamera() {
    if (canvasWrapSuspended || canvasFocusedPosition !== null) return;
    canvasX = canvasRenderX;
    canvasY = canvasRenderY;
  }

  function updateCanvasRenderCoordinates() {
    const layout = getCanvasLayout();
    const periodX = layout.width * canvasScale;
    const periodY = layout.height * canvasScale;
    canvasRenderX = canvasWrapSuspended || canvasFocusedPosition !== null
      ? canvasX
      : wrapCanvasCameraAxis(canvasX, periodX);
    canvasRenderY = canvasWrapSuspended || canvasFocusedPosition !== null
      ? canvasY
      : wrapCanvasCameraAxis(canvasY, periodY);
  }

  function canvasIsActive() {
    return prototypeHostActive && !document.hidden
      && (!document.body.dataset.route || document.body.dataset.route === "home")
      && document.body.dataset.homeMode !== "bento";
  }

  function syncCanvasActivity() {
    syncPortalActivity();
    if (canvasIsActive()) {
      canvasRenderLastTime = 0;
      requestCanvasRender(true);
    } else {
      cancelCanvasGesture();
      cancelCanvasInertia();
      canvasCameraAnimation = null;
      if (canvasRenderFrame) cancelAnimationFrame(canvasRenderFrame);
      canvasRenderFrame = 0;
      canvasRenderLastTime = 0;
      assetCanvasViewport.classList.remove("is-camera-animating");
      // Finish pending focus transitions at their already-committed target state.
      cancelFocusAnimations();
    }
  }

  function requestCanvasRender(forceWrap = false) {
    canvasRenderDirty = true;
    canvasForceWrapRender = canvasForceWrapRender || forceWrap;
    if (canvasIsActive() && !canvasRenderFrame) canvasRenderFrame = requestAnimationFrame(renderCanvasFrame);
  }

  function renderCanvasFrame(time = performance.now()) {
    canvasRenderFrame = 0;
    if (!canvasIsActive()) return;
    const deltaTime = canvasRenderLastTime ? Math.min(Math.max(time - canvasRenderLastTime, 1), 50) : 16;
    canvasRenderLastTime = time;
    let keepRendering = false;
    let inertiaSettled = false;

    if (canvasCameraAnimation) {
      if (!canvasCameraAnimation.startTime) canvasCameraAnimation.startTime = time;
      const progress = clamp((time - canvasCameraAnimation.startTime) / canvasCameraAnimation.duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      canvasX = lerp(canvasCameraAnimation.fromX, canvasCameraAnimation.toX, eased);
      canvasY = lerp(canvasCameraAnimation.fromY, canvasCameraAnimation.toY, eased);
      canvasScale = lerp(canvasCameraAnimation.fromScale, canvasCameraAnimation.toScale, eased);
      if (progress >= 1) {
        canvasX = canvasCameraAnimation.toX;
        canvasY = canvasCameraAnimation.toY;
        canvasScale = canvasCameraAnimation.toScale;
        canvasCameraAnimation = null;
        assetCanvasViewport.classList.remove("is-camera-animating");
      } else keepRendering = true;
      canvasRenderDirty = true;
    }

    if (canvasInertia) {
      const inertiaDelta = Math.min(Math.max(deltaTime / 1000, 0.001), 0.032);
      canvasInertia.velocityX *= Math.exp(-5.5 * inertiaDelta);
      canvasInertia.velocityY *= Math.exp(-5.5 * inertiaDelta);
      canvasX += canvasInertia.velocityX * inertiaDelta;
      canvasY += canvasInertia.velocityY * inertiaDelta;
      updateCanvasTrail(canvasInertia.velocityX, canvasInertia.velocityY);
      if (Math.hypot(canvasInertia.velocityX, canvasInertia.velocityY) < 8) {
        canvasInertia = null;
        inertiaSettled = true;
        assetCanvasViewport.classList.remove("is-camera-moving");
        updateCanvasTrail(0, 0);
      } else keepRendering = true;
      canvasRenderDirty = true;
    }

    if (
      Math.abs(canvasParallaxCurrentX - canvasParallaxTargetX) > 0.02
      || Math.abs(canvasParallaxCurrentY - canvasParallaxTargetY) > 0.02
    ) {
      const amount = reduceMotionQuery.matches ? 1 : 1 - Math.exp(-deltaTime / 58);
      canvasParallaxCurrentX = lerp(canvasParallaxCurrentX, canvasParallaxTargetX, amount);
      canvasParallaxCurrentY = lerp(canvasParallaxCurrentY, canvasParallaxTargetY, amount);
      if (
        Math.abs(canvasParallaxCurrentX - canvasParallaxTargetX) <= 0.02
        && Math.abs(canvasParallaxCurrentY - canvasParallaxTargetY) <= 0.02
      ) {
        canvasParallaxCurrentX = canvasParallaxTargetX;
        canvasParallaxCurrentY = canvasParallaxTargetY;
      } else keepRendering = true;
      canvasRenderDirty = true;
    }

    if (Math.abs(canvasFisheyeStrength - canvasFisheyeTargetStrength) > 0.001) {
      const amount = reduceMotionQuery.matches ? 1 : 1 - Math.exp(-deltaTime / 58);
      canvasFisheyeStrength = lerp(canvasFisheyeStrength, canvasFisheyeTargetStrength, amount);
      if (Math.abs(canvasFisheyeStrength - canvasFisheyeTargetStrength) <= 0.001) {
        canvasFisheyeStrength = canvasFisheyeTargetStrength;
      } else keepRendering = true;
      canvasRenderDirty = true;
    }

    if (canvasRenderDirty) {
      updateCanvasRenderCoordinates();
      assetCanvasViewport.style.setProperty("--canvas-x", `${canvasRenderX}px`);
      assetCanvasViewport.style.setProperty("--canvas-y", `${canvasRenderY}px`);
      assetCanvasViewport.style.setProperty("--canvas-scale", String(canvasScale));
      assetCanvasViewport.style.setProperty("--canvas-stage-shift-x", `${canvasParallaxCurrentX.toFixed(2)}px`);
      assetCanvasViewport.style.setProperty("--canvas-stage-shift-y", `${canvasParallaxCurrentY.toFixed(2)}px`);
      assetCanvasViewport.style.setProperty("--canvas-fisheye-strength", canvasFisheyeStrength.toFixed(4));
      assetCanvasViewport.style.setProperty("--canvas-stage-depth", `${(102 * canvasFisheyeStrength).toFixed(2)}px`);
      assetCanvasViewport.style.setProperty("--canvas-stage-saturation", (1 + 0.11 * canvasFisheyeStrength).toFixed(4));
      assetCanvasViewport.style.setProperty("--canvas-stage-contrast", (1 + 0.075 * canvasFisheyeStrength).toFixed(4));
      assetCanvasViewport.style.setProperty("--canvas-stage-brightness", (1 + 0.025 * canvasFisheyeStrength).toFixed(4));
      const gridSize = 40 * canvasScale;
      assetCanvasViewport.style.setProperty("--canvas-grid-size", `${gridSize}px`);
      assetCanvasViewport.style.setProperty("--canvas-grid-x", `${canvasRenderX % gridSize}px`);
      assetCanvasViewport.style.setProperty("--canvas-grid-y", `${canvasRenderY % gridSize}px`);
      updateCanvasAssetWraps(canvasRenderX, canvasRenderY, canvasForceWrapRender);
      updateCanvasFisheyeTransforms();
      if (inertiaSettled) {
        canvasX = canvasRenderX;
        canvasY = canvasRenderY;
      }
      canvasRenderDirty = false;
      canvasForceWrapRender = false;
    }

    if (keepRendering) requestCanvasRender();
  }

  function flushCanvasRender(forceWrap = false) {
    if (canvasRenderFrame) cancelAnimationFrame(canvasRenderFrame);
    canvasRenderFrame = 0;
    canvasForceWrapRender = canvasForceWrapRender || forceWrap;
    canvasRenderDirty = true;
    renderCanvasFrame(performance.now());
  }

  function applyCanvasPosition(_constrain = true, immediate = false) {
    updateCanvasRenderCoordinates();
    if (immediate) flushCanvasRender();
    else requestCanvasRender();
  }

  function syncCameraFromVisual() {
    if (!canvasCameraAnimation) return;
    canvasCameraAnimation = null;
    assetCanvasViewport.classList.remove("is-camera-animating");
    applyCanvasPosition(false);
  }

  function animateCameraTo(x, y, scale, duration = 720) {
    syncCameraFromVisual();
    if (reduceMotionQuery.matches || duration <= 1) {
      canvasX = x;
      canvasY = y;
      canvasScale = scale;
      applyCanvasPosition(false, true);
      return;
    }
    canvasCameraAnimation = {
      fromX: canvasX,
      fromY: canvasY,
      fromScale: canvasScale,
      toX: x,
      toY: y,
      toScale: scale,
      duration,
      startTime: 0,
    };
    assetCanvasViewport.classList.add("is-camera-animating");
    requestCanvasRender();
  }

  function updateCanvasTrail(velocityX = 0, velocityY = 0) {
    const speed = Math.hypot(velocityX, velocityY);
    const strength = reduceMotionQuery.matches ? 0 : smoothstep(130, 1900, speed);
    if (!canvasTrailNear || !canvasTrailFar || strength < 0.008 || canvasFocusedPosition !== null) {
      assetCanvasViewport.style.setProperty("--trail-near-opacity", "0");
      assetCanvasViewport.style.setProperty("--trail-far-opacity", "0");
      assetCanvasViewport.classList.remove("is-moving");
      return;
    }
    const directionX = velocityX / speed;
    const directionY = velocityY / speed;
    const distance = lerp(0, window.innerWidth < 700 ? 18 : 34, strength);
    assetCanvasViewport.style.setProperty("--trail-near-x", `${(-directionX * distance * 0.44).toFixed(2)}px`);
    assetCanvasViewport.style.setProperty("--trail-near-y", `${(-directionY * distance * 0.44).toFixed(2)}px`);
    assetCanvasViewport.style.setProperty("--trail-far-x", `${(-directionX * distance).toFixed(2)}px`);
    assetCanvasViewport.style.setProperty("--trail-far-y", `${(-directionY * distance).toFixed(2)}px`);
    assetCanvasViewport.style.setProperty("--trail-near-opacity", String(strength * 0.16));
    assetCanvasViewport.style.setProperty("--trail-far-opacity", String(strength * 0.07));
    assetCanvasViewport.classList.add("is-moving");
  }

  function cancelCanvasInertia(resetTrail = true) {
    canvasInertia = null;
    assetCanvasViewport.classList.remove("is-camera-moving");
    if (resetTrail) updateCanvasTrail(0, 0);
  }

  function startCanvasInertia(initialVelocityX, initialVelocityY) {
    cancelCanvasInertia(false);
    if (reduceMotionQuery.matches || canvasFocusedPosition !== null) {
      rebaseCanvasCamera();
      applyCanvasPosition(false);
      updateCanvasTrail(0, 0);
      return;
    }

    assetCanvasViewport.classList.add("is-camera-moving");

    canvasInertia = {
      velocityX: clamp(initialVelocityX || 0, -2400, 2400),
      velocityY: clamp(initialVelocityY || 0, -2400, 2400),
    };
    requestCanvasRender();
  }

  function assetStateTransform(state) {
    return `translate3d(${state.burstX}px, ${state.burstY}px, 0) scale(${state.burstScale}) rotate(${state.rotation}deg)`;
  }

  function applyAssetState(element, state) {
    element.style.transform = assetStateTransform(state);
    element.style.opacity = String(state.opacity);
  }

  function cancelFocusAnimations() {
    focusAnimations.forEach((animation) => animation.cancel());
    focusAnimations = [];
    canvasAssetElements.forEach((element) => { element.style.willChange = ""; });
  }

  function rebuildCanvasTrails() {
    canvasImageObserver.disconnect();
    canvasTrailNear?.remove();
    canvasTrailFar?.remove();
    const createTrail = (variant) => {
      const trail = assetCanvasWorld.cloneNode(true);
      trail.removeAttribute("id");
      trail.classList.add("asset-canvas-trail", `trail-${variant}`);
      trail.setAttribute("aria-hidden", "true");
      trail.inert = true;
      return trail;
    };
    canvasTrailFar = createTrail("far");
    canvasTrailNear = createTrail("near");
    canvasTrailFarAssets = [...canvasTrailFar.querySelectorAll(".canvas-asset")];
    canvasTrailNearAssets = [...canvasTrailNear.querySelectorAll(".canvas-asset")];
    assetCanvasStage.insertBefore(canvasTrailFar, assetCanvasWorld);
    assetCanvasStage.insertBefore(canvasTrailNear, assetCanvasWorld);
    assetCanvasStage.querySelectorAll(".canvas-asset img").forEach((image) => canvasImageObserver.observe(image));
    updateCanvasAssetWraps(canvasRenderX, canvasRenderY, true);
    requestCanvasRender(true);
    updateCanvasTrail(0, 0);
  }

  function layoutCanvasAssets(force = false) {
    const layout = getCanvasLayout();
    const nextKey = `${layout.columns}x${layout.rows}`;
    if (!force && canvasLayoutKey === nextKey) return;
    if (canvasFocusedPosition !== null) clearCanvasFocus(false);
    canvasLayoutKey = nextKey;
    assetCanvasWorld.style.width = `${layout.width}px`;
    assetCanvasWorld.style.height = `${layout.height}px`;

    const cellWidth = layout.width / layout.columns;
    const cellHeight = layout.height / layout.rows;
    canvasAssetStates = canvasAssetElements.map((element, position) => {
      const asset = canvasAssets[position];
      const column = position % layout.columns;
      const row = Math.floor(position / layout.columns);
      const size = layout.assetSize;
      const x = column * cellWidth + (cellWidth - size) / 2;
      const y = row * cellHeight + (cellHeight - size) / 2;
      const state = {
        x,
        y,
        wrapX: 0,
        wrapY: 0,
        size,
        imageScale: Number(element.dataset.imageScale || 1),
        rotation: 0,
        burstX: 0,
        burstY: 0,
        burstScale: 1,
        opacity: 1,
      };
      setCanvasWrappedAssetPosition(element, state);
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.zIndex = "1";
      element.classList.remove("is-canvas-selected");
      applyAssetState(element, state);
      return state;
    });
    rebuildCanvasTrails();
  }

  function placeCanvasAtStart(animate = false) {
    cancelCanvasInertia();
    syncCameraFromVisual();
    const layout = getCanvasLayout();
    const limits = getCanvasScaleLimits();
    const coverScale = Math.max(
      canvasViewportWidth / layout.width,
      canvasViewportHeight / layout.height,
    );
    const targetScale = clamp(coverScale * 1.15, limits.minimum, limits.maximum);
    const targetX = (canvasViewportWidth - layout.width * targetScale) / 2;
    const targetY = (canvasViewportHeight - layout.height * targetScale) / 2;
    canvasHasPosition = true;
    if (animate) animateCameraTo(targetX, targetY, targetScale, reduceMotionQuery.matches ? 1 : 520);
    else {
      canvasX = targetX;
      canvasY = targetY;
      canvasScale = targetScale;
      applyCanvasPosition(false, true);
    }
  }

  function zoomCanvas(nextScale, clientX = canvasViewportWidth / 2, clientY = canvasViewportHeight / 2) {
    if (canvasFocusedPosition !== null) return;
    syncCameraFromVisual();
    rebaseCanvasCamera();
    const limits = getCanvasScaleLimits();
    const targetScale = clamp(nextScale, limits.minimum, limits.maximum);
    const worldX = (clientX - canvasX) / canvasScale;
    const worldY = (clientY - canvasY) / canvasScale;
    canvasX = clientX - worldX * targetScale;
    canvasY = clientY - worldY * targetScale;
    canvasScale = targetScale;
    applyCanvasPosition();
  }

  function animateAssetState(element, state, target, options = {}) {
    const start = { ...state };
    Object.assign(state, target);
    applyAssetState(element, state);
    if (reduceMotionQuery.matches || (options.duration || 900) <= 1) return null;
    element.style.willChange = "transform, opacity";
    const selected = options.selected;
    const targetTransform = assetStateTransform(state);
    const keyframes = selected
      ? [
        { transform: assetStateTransform(start), opacity: start.opacity, offset: 0 },
        { transform: assetStateTransform({ ...start, burstScale: start.burstScale * 0.94 }), opacity: 1, offset: 0.07 },
        { transform: assetStateTransform({ ...state, burstScale: state.burstScale * 1.045 }), opacity: 1, offset: 0.78 },
        { transform: targetTransform, opacity: state.opacity, offset: 1 },
      ]
      : [
        { transform: assetStateTransform(start), opacity: start.opacity, offset: 0 },
        { transform: assetStateTransform({
          ...start,
          burstX: lerp(start.burstX, state.burstX, 0.22),
          burstY: lerp(start.burstY, state.burstY, 0.22),
          burstScale: lerp(start.burstScale, state.burstScale, 0.2),
        }), opacity: lerp(start.opacity, state.opacity, 0.2), offset: 0.22 },
        { transform: assetStateTransform({ ...state, burstX: state.burstX * 1.035, burstY: state.burstY * 1.035 }), opacity: state.opacity, offset: 0.82 },
        { transform: targetTransform, opacity: state.opacity, offset: 1 },
      ];
    const animation = element.animate(keyframes, {
      duration: options.duration || 900,
      delay: options.delay || 0,
      easing: selected ? "cubic-bezier(.16,1,.3,1)" : "cubic-bezier(.22,.78,.18,1)",
      fill: "backwards",
    });
    focusAnimations.push(animation);
    animation.finished.then(() => {
      animation.cancel();
      element.style.willChange = "";
      applyAssetState(element, state);
    }).catch(() => {});
    return animation;
  }

  function focusCanvasAsset(position, returnElement) {
    const selectedElement = canvasAssetElements[position];
    const selectedState = canvasAssetStates[position];
    const asset = canvasAssets[position];
    if (!selectedElement || !selectedState || !asset) return;
    if (canvasFocusedPosition === position) {
      clearCanvasFocus(true, returnElement);
      return;
    }

    if (canvasFocusedPosition !== null) {
      setCanvasPreview(canvasAssetElements[canvasFocusedPosition].querySelector("img"), canvasAssets[canvasFocusedPosition].file);
    }
    canvasFocusReturnElement = returnElement || selectedElement;

    releaseCanvasPressFeedback();
    resetCanvasParallax(true);
    suspendCanvasFisheye();
    cancelCanvasInertia();
    updateCanvasTrail(0, 0);
    syncCameraFromVisual();
    cancelFocusAnimations();
    if (canvasFocusedPosition === null) {
      rebaseCanvasCamera();
      applyCanvasPosition(false);
      window.clearTimeout(canvasWrapResumeTimer);
      canvasWrapSuspended = true;
      canvasCameraBeforeFocus = { x: canvasX, y: canvasY, scale: canvasScale };
    }
    canvasFocusedPosition = position;
    homePage.classList.add("is-canvas-focus");
    canvasFocusName.textContent = asset.name;
    canvasFocusCategory.textContent = asset.category;
    canvasFocusCaption.hidden = false;

    const viewportWidth = canvasViewportWidth;
    const viewportHeight = canvasViewportHeight;
    const layout = getCanvasLayout();
    const limits = getCanvasScaleLimits();
    const targetCameraScale = clamp(Math.max(canvasScale, layout.mobile ? 0.5 : 0.72), limits.minimum, limits.maximum);
    const selectedCenterX = canvasStateX(selectedState) + selectedState.size / 2;
    const selectedCenterY = canvasStateY(selectedState) + selectedState.size / 2;
    const safeTop = Math.min(viewportHeight * 0.22, layout.mobile ? 84 : 92);
    const captionReserve = layout.mobile ? 98 : 88;
    const safeBottom = Math.max(safeTop + 240, viewportHeight - captionReserve);
    const focusCenterX = viewportWidth / 2;
    const focusCenterY = (safeTop + safeBottom) / 2;
    const targetX = focusCenterX - selectedCenterX * targetCameraScale;
    const targetY = focusCenterY - selectedCenterY * targetCameraScale;
    animateCameraTo(targetX, targetY, targetCameraScale, reduceMotionQuery.matches ? 180 : 760);

    const desiredSize = Math.min(
      viewportWidth - (layout.mobile ? 48 : 120),
      safeBottom - safeTop - 24,
      layout.mobile ? 390 : 600,
    );
    const selectedScale = clamp(desiredSize / (selectedState.size * targetCameraScale * 0.78), 1.6, 5.2);
    const craterRadius = desiredSize * 0.61;
    const nodes = [];

    canvasAssetStates.forEach((state, index) => {
      if (index === position) return;
      const baseX = targetX + (canvasStateX(state) + state.size / 2) * targetCameraScale;
      const baseY = targetY + (canvasStateY(state) + state.size / 2) * targetCameraScale;
      let dx = baseX - focusCenterX;
      let dy = baseY - focusCenterY;
      let distance = Math.hypot(dx, dy);
      if (distance < 0.01) {
        const angle = hashUnit(`${canvasAssets[index].file}-burst`) * Math.PI * 2;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        distance = 1;
      }
      const influence = 1 - smoothstep(craterRadius * 0.8, craterRadius * 2.25, distance);
      const targetScale = lerp(0.72, 0.46, influence);
      const radius = state.size * targetCameraScale * targetScale * 0.43 + 9;
      const requiredDistance = craterRadius + radius + 18;
      const push = Math.max(0, requiredDistance - distance);
      const normalX = dx / distance;
      const normalY = dy / distance;
      nodes.push({
        index,
        baseX,
        baseY,
        x: baseX + normalX * push,
        y: baseY + normalY * push,
        radius,
        targetScale,
        targetOpacity: lerp(0.9, 0.55, influence),
        initialDistance: distance,
      });
    });

    for (let pass = 0; pass < 12; pass += 1) {
      nodes.forEach((node) => {
        let dx = node.x - focusCenterX;
        let dy = node.y - focusCenterY;
        let distance = Math.hypot(dx, dy);
        if (distance < 0.01) {
          const angle = hashUnit(`${node.index}-${pass}`) * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distance = 1;
        }
        const required = craterRadius + node.radius + 18;
        if (distance < required) {
          node.x = focusCenterX + dx / distance * required;
          node.y = focusCenterY + dy / distance * required;
        }
      });
      for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
          const first = nodes[firstIndex];
          const second = nodes[secondIndex];
          let dx = second.x - first.x;
          let dy = second.y - first.y;
          let distance = Math.hypot(dx, dy);
          if (distance < 0.01) {
            const angle = hashUnit(`${first.index}-${second.index}`) * Math.PI * 2;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            distance = 1;
          }
          const required = first.radius + second.radius + 10;
          if (distance >= required) continue;
          const correction = (required - distance) * 0.52;
          const normalX = dx / distance;
          const normalY = dy / distance;
          first.x -= normalX * correction;
          first.y -= normalY * correction;
          second.x += normalX * correction;
          second.y += normalY * correction;
        }
      }
    }
    const nodeByIndex = new Map(nodes.map((node) => [node.index, node]));

    canvasAssetElements.forEach((element, index) => {
      const state = canvasAssetStates[index];
      element.classList.toggle("is-canvas-selected", index === position);
      element.style.zIndex = index === position ? "100" : "1";
      const image = element.querySelector("img");
      if (index === position) {
        image.removeAttribute("srcset");
        image.src = assetUrl(asset.file);
        animateAssetState(element, state, { burstX: 0, burstY: 0, burstScale: selectedScale, opacity: 1 }, {
          selected: true,
          duration: reduceMotionQuery.matches ? 180 : 1080,
        });
        return;
      }

      const node = nodeByIndex.get(index);
      const burstX = (node.x - node.baseX) / targetCameraScale;
      const burstY = (node.y - node.baseY) / targetCameraScale;
      const stableJitter = hashUnit(`${canvasAssets[index].file}-wave`) * 34;
      const delay = reduceMotionQuery.matches ? 0 : clamp(node.initialDistance * 0.15 + stableJitter, 0, 210);
      animateAssetState(element, state, {
        burstX,
        burstY,
        burstScale: node.targetScale,
        opacity: node.targetOpacity,
      }, {
        delay,
        duration: reduceMotionQuery.matches ? 180 : 850,
      });
    });
  }

  function clearCanvasFocus(animate = true, returnElement = null) {
    if (canvasFocusedPosition === null) return;
    const previousPosition = canvasFocusedPosition;
    setCanvasPreview(canvasAssetElements[previousPosition].querySelector("img"), canvasAssets[previousPosition].file);
    const focusReturnTarget = returnElement
      || (animate ? canvasFocusReturnElement || canvasAssetElements[previousPosition] : null);
    canvasFocusedPosition = null;
    canvasFocusReturnElement = null;
    cancelFocusAnimations();
    homePage.classList.remove("is-canvas-focus");
    canvasFocusCaption.hidden = true;

    const returnDuration = animate && !reduceMotionQuery.matches ? 650 : 1;
    canvasAssetElements.forEach((element, index) => {
      element.classList.remove("is-canvas-selected");
      element.style.zIndex = "1";
      const state = canvasAssetStates[index];
      animateAssetState(element, state, { burstX: 0, burstY: 0, burstScale: 1, opacity: 1 }, {
        selected: index === previousPosition,
        duration: returnDuration,
        delay: animate && !reduceMotionQuery.matches ? hashUnit(`${canvasAssets[index].file}-return`) * 70 : 0,
      });
    });

    if (canvasCameraBeforeFocus) {
      const camera = canvasCameraBeforeFocus;
      animateCameraTo(camera.x, camera.y, camera.scale, returnDuration);
    }
    canvasCameraBeforeFocus = null;
    window.clearTimeout(canvasWrapResumeTimer);
    const resumeWrapping = () => {
      canvasWrapSuspended = false;
      rebaseCanvasCamera();
      applyCanvasPosition(false);
    };
    if (returnDuration <= 1) resumeWrapping();
    else canvasWrapResumeTimer = window.setTimeout(resumeWrapping, returnDuration + 24);
    resumeCanvasFisheye();
    if (focusReturnTarget?.isConnected) focusReturnTarget.focus({ preventScroll: true });
  }

  function beginCanvasPinch() {
    const points = [...activeCanvasPointers.values()];
    if (points.length < 2 || canvasFocusedPosition !== null) return;
    const [first, second] = points;
    const midpointX = (first.x + second.x) / 2;
    const midpointY = (first.y + second.y) / 2;
    canvasPinch = {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      scale: canvasScale,
      worldX: (midpointX - canvasX) / canvasScale,
      worldY: (midpointY - canvasY) / canvasScale,
    };
    canvasDrag.active = false;
    canvasDrag.targetAsset = null;
    canvasGestureHadPinch = true;
    releaseCanvasPressFeedback();
    cancelCanvasInertia();
    assetCanvasViewport.classList.add("is-camera-moving");
    activeCanvasPointers.forEach((_point, pointerId) => {
      if (!assetCanvasViewport.hasPointerCapture(pointerId)) assetCanvasViewport.setPointerCapture(pointerId);
    });
  }

  function updateCanvasPinch(event) {
    if (!canvasPinch || activeCanvasPointers.size < 2) return false;
    const [first, second] = [...activeCanvasPointers.values()];
    const midpointX = (first.x + second.x) / 2;
    const midpointY = (first.y + second.y) / 2;
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    const limits = getCanvasScaleLimits();
    canvasScale = clamp(canvasPinch.scale * distance / Math.max(canvasPinch.distance, 1), limits.minimum, limits.maximum);
    canvasX = midpointX - canvasPinch.worldX * canvasScale;
    canvasY = midpointY - canvasPinch.worldY * canvasScale;
    applyCanvasPosition();
    event.preventDefault();
    return true;
  }

  function finishCanvasDrag(event, cancelled = false) {
    clearCanvasLongPress();
    activeCanvasPointers.delete(event.pointerId);
    if (activeCanvasPointers.size === 0) releaseCanvasPressFeedback();
    if (cancelled) {
      cancelCanvasGesture();
      return;
    }
    if (canvasGestureHadPinch) {
      if (activeCanvasPointers.size < 2) canvasPinch = null;
      suppressCanvasClickUntil = performance.now() + 320;
      if (activeCanvasPointers.size === 0) {
        canvasGestureHadPinch = false;
        assetCanvasViewport.classList.remove("is-camera-moving");
        rebaseCanvasCamera();
        applyCanvasPosition(false);
      }
      if (assetCanvasViewport.hasPointerCapture(event.pointerId)) assetCanvasViewport.releasePointerCapture(event.pointerId);
      return;
    }
    if (!canvasDrag.active || event.pointerId !== canvasDrag.pointerId) return;
    canvasDrag.active = false;
    if (canvasDrag.moved) {
      suppressCanvasClickUntil = performance.now() + 350;
      startCanvasInertia(canvasDrag.velocityX, canvasDrag.velocityY);
    }
    canvasDrag.targetAsset = null;
    const viewportRect = assetCanvasViewport.getBoundingClientRect();
    if (
      event.clientX < viewportRect.left
      || event.clientX > viewportRect.right
      || event.clientY < viewportRect.top
      || event.clientY > viewportRect.bottom
    ) resetCanvasParallax();
    if (assetCanvasViewport.hasPointerCapture(event.pointerId)) assetCanvasViewport.releasePointerCapture(event.pointerId);
  }

  function initCanvasInteractions() {
    assetCanvasViewport.addEventListener("pointerenter", updateCanvasParallaxFromPointer, { passive: true });
    assetCanvasViewport.addEventListener("pointerleave", () => {
      if (!canvasDrag.active && activeCanvasPointers.size === 0) resetCanvasParallax();
    }, { passive: true });

    assetCanvasViewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || homePage.classList.contains("is-bento")) return;
      if (activeCanvasPointers.size === 0) {
        canvasGestureHadPinch = false;
        suppressCanvasClickUntil = 0;
      }
      activeCanvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activeCanvasPointers.size >= 2) {
        beginCanvasPinch();
        return;
      }
      if (canvasFocusedPosition !== null) return;
      resetCanvasParallax();
      cancelCanvasInertia();
      syncCameraFromVisual();
      if (canvasWrapSuspended) {
        window.clearTimeout(canvasWrapResumeTimer);
        canvasWrapSuspended = false;
        applyCanvasPosition(false);
      }
      rebaseCanvasCamera();
      canvasDrag.active = true;
      canvasDrag.moved = false;
      canvasDrag.pointerId = event.pointerId;
      canvasDrag.startX = event.clientX;
      canvasDrag.startY = event.clientY;
      canvasDrag.originX = canvasX;
      canvasDrag.originY = canvasY;
      canvasDrag.lastX = event.clientX;
      canvasDrag.lastY = event.clientY;
      canvasDrag.lastTime = performance.now();
      canvasDrag.velocityX = 0;
      canvasDrag.velocityY = 0;
      canvasDrag.targetAsset = event.target.closest(".canvas-asset");
      scheduleCanvasLongPress(event.pointerId);
    });

    assetCanvasViewport.addEventListener("pointermove", (event) => {
      updateCanvasParallaxFromPointer(event);
      if (activeCanvasPointers.has(event.pointerId)) activeCanvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (updateCanvasPinch(event)) return;
      if (!canvasDrag.active || event.pointerId !== canvasDrag.pointerId || canvasFocusedPosition !== null) return;
      const deltaX = event.clientX - canvasDrag.startX;
      const deltaY = event.clientY - canvasDrag.startY;
      if (Math.hypot(deltaX, deltaY) > 6 && !canvasDrag.moved) {
        canvasDrag.moved = true;
        clearCanvasLongPress();
        assetCanvasViewport.classList.add("is-canvas-pressed", "is-dragging", "is-camera-moving");
        assetCanvasViewport.setPointerCapture(event.pointerId);
      }
      if (!canvasDrag.moved) return;
      event.preventDefault();
      const now = performance.now();
      const deltaTime = Math.max(now - canvasDrag.lastTime, 8);
      const instantVelocityX = (event.clientX - canvasDrag.lastX) / deltaTime * 1000;
      const instantVelocityY = (event.clientY - canvasDrag.lastY) / deltaTime * 1000;
      canvasDrag.velocityX = canvasDrag.velocityX * 0.72 + instantVelocityX * 0.28;
      canvasDrag.velocityY = canvasDrag.velocityY * 0.72 + instantVelocityY * 0.28;
      canvasDrag.lastX = event.clientX;
      canvasDrag.lastY = event.clientY;
      canvasDrag.lastTime = now;

      canvasX = canvasDrag.originX + deltaX;
      canvasY = canvasDrag.originY + deltaY;
      applyCanvasPosition(false);
      updateCanvasTrail(canvasDrag.velocityX, canvasDrag.velocityY);
    });

    assetCanvasViewport.addEventListener("pointerup", finishCanvasDrag);
    assetCanvasViewport.addEventListener("pointercancel", (event) => {
      canvasDrag.velocityX = 0;
      canvasDrag.velocityY = 0;
      finishCanvasDrag(event, true);
    });

    assetCanvasViewport.addEventListener("click", (event) => {
      if (canvasFocusedPosition !== null && !event.target.closest(".canvas-asset")) clearCanvasFocus(true);
    });

    assetCanvasViewport.addEventListener("wheel", (event) => {
      if (homePage.classList.contains("is-bento") || canvasFocusedPosition !== null) return;
      event.preventDefault();
      cancelCanvasInertia(false);
      syncCameraFromVisual();
      if (canvasWrapSuspended) {
        window.clearTimeout(canvasWrapResumeTimer);
        canvasWrapSuspended = false;
        applyCanvasPosition(false);
      }
      rebaseCanvasCamera();
      assetCanvasViewport.classList.add("is-camera-moving");
      window.clearTimeout(canvasWheelTrailTimer);
      if (event.ctrlKey || event.metaKey) {
        const zoomFactor = Math.exp(-event.deltaY * 0.008);
        zoomCanvas(canvasScale * zoomFactor, event.clientX, event.clientY);
      } else {
        canvasX -= event.deltaX + (event.shiftKey ? event.deltaY : 0);
        canvasY -= event.shiftKey ? 0 : event.deltaY;
        applyCanvasPosition();
        updateCanvasTrail(-event.deltaX * 24, -event.deltaY * 24);
      }
      canvasWheelTrailTimer = window.setTimeout(() => {
        rebaseCanvasCamera();
        applyCanvasPosition(false);
        updateCanvasTrail(0, 0);
        assetCanvasViewport.classList.remove("is-camera-moving");
      }, 130);
    }, { passive: false });

    const resizeObserver = new ResizeObserver((entries) => {
      const bounds = entries[0]?.contentRect;
      syncCanvasViewportMetrics(bounds?.width, bounds?.height);
      cancelCanvasInertia();
      cancelCanvasGesture();
      if (canvasFocusedPosition !== null) clearCanvasFocus(false);
      const nextKey = window.innerWidth < 700 ? "6x11" : "11x6";
      if (canvasLayoutKey && canvasLayoutKey !== nextKey) {
        layoutCanvasAssets(true);
        placeCanvasAtStart(false);
      } else if (!canvasHasPosition) placeCanvasAtStart(false);
      else {
        const limits = getCanvasScaleLimits();
        if (canvasScale < limits.minimum) {
          zoomCanvas(
            limits.minimum,
            canvasViewportWidth / 2,
            canvasViewportHeight / 2,
          );
        } else applyCanvasPosition(false, true);
      }
    });
    resizeObserver.observe(assetCanvasViewport);
    document.addEventListener("visibilitychange", syncCanvasActivity);
    window.addEventListener("message", (event) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (event.data?.type !== "portfolio:prototype-visibility") return;
      prototypeHostActive = event.data.visible === true;
      syncCanvasActivity();
    });
    window.addEventListener("blur", () => {
      cancelCanvasInertia();
      resetCanvasParallax(true);
      cancelCanvasGesture();
    });
  }

  function buildAssetCanvas() {
    const byFile = new Map(assets.map((asset) => [asset.file, asset]));
    const preferred = canvasLeadFiles.map((file) => byFile.get(file)).filter(Boolean);
    const preferredFiles = new Set(preferred.map((asset) => asset.file));
    canvasAssets = preferred.concat(assets.filter((asset) => !preferredFiles.has(asset.file)));
    const fragment = document.createDocumentFragment();

    canvasAssets.forEach((asset, position) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "canvas-asset";
      if (asset.file === "silver-tiktok-note.png") button.classList.add("canvas-asset-square-frame");
      button.setAttribute("aria-label", `Focus ${asset.name}`);
      button.dataset.canvasPosition = String(position);
      const metric = assetVisualMetrics.get(asset.file) || defaultAssetMetric;
      button.dataset.imageScale = String(metric.scale);
      button.style.setProperty("--asset-scale", String(metric.scale));
      button.style.setProperty("--asset-hover-scale", String(metric.scale * 1.055));
      button.style.setProperty("--asset-x", `${metric.x}%`);
      button.style.setProperty("--asset-y", `${metric.y}%`);

      const image = document.createElement("img");
      image.dataset.assetFile = asset.file;
      image.alt = "";
      image.style.visibility = "hidden";
      image.decoding = "async";
      image.draggable = false;
      const lens = document.createElement("span");
      lens.className = "canvas-asset-lens";
      lens.appendChild(image);
      button.appendChild(lens);
      button.addEventListener("click", (event) => {
        if (event.detail > 0 && performance.now() < suppressCanvasClickUntil) return;
        focusCanvasAsset(position, button);
      });
      canvasAssetElements.push(button);
      fragment.appendChild(button);
    });

    assetCanvasWorld.replaceChildren(fragment);
    syncCanvasViewportMetrics();
    buildCanvasFisheyeRules(canvasAssets.length);
    layoutCanvasAssets(true);
    placeCanvasAtStart(false);
    initCanvasInteractions();
  }

  function setHomeMode(mode) {
    const isBento = mode === "bento";
    if (canvasFocusedPosition !== null) clearCanvasFocus(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.body.dataset.homeMode = isBento ? "bento" : "canvas";
    homePage.classList.toggle("is-bento", isBento);
    homeViewToggle.setAttribute("aria-pressed", String(isBento));
    homeViewToggle.setAttribute("aria-label", isBento ? "Open draggable canvas" : "Open bento categories");
    homeViewToggle.querySelector(".mode-label").textContent = isBento ? "Canvas" : "Bento";
    document.getElementById("categoryPortal").inert = !isBento;
    assetCanvasViewport.inert = isBento;
    if (isBento) {
      resetCanvasParallax(true);
      cancelCanvasGesture();
      suspendCanvasFisheye();
      cancelCanvasInertia();
    } else {
      resumeCanvasFisheye();
    }
    syncCanvasActivity();
  }

  function buildPortalStack() {
    const stack = document.getElementById("portalAssetStack");
    const collageAssets = [
      { file: "magenta-pixel-smile-coin.png", role: "pixel-pink" },
      { file: "safe-payments-wallet.png", role: "wallet" },
      { file: "paylater-trophy.png", role: "paylater" },
      { file: "cyan-tiktok-coin.png", role: "cyan-coin" },
      { file: "discount-work-glove.png", role: "glove" },
      { file: "cash-advance-parcel.png", role: "parcel" },
      { file: "creator-card-gummy-bear.png", role: "bear" },
      { file: "mint-pixel-smile-coin.png", role: "pixel-mint" },
      { file: "lime-tiktok-coin.png", role: "lime-coin" },
    ];
    const fragment = document.createDocumentFragment();
    collageAssets.forEach(({ file, role }) => {
      const image = document.createElement("img");
      image.src = previewUrl(file, 512);
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.dataset.stackRole = role;
      fragment.appendChild(image);
    });
    stack.replaceChildren(fragment);
  }

  function buildFilters() {
    const preferredOrder = ["All", "Brand", "Wallets", "Security", "Commerce", "Coins", "Symbols", "Objects"];
    const counts = assets.reduce((map, asset) => {
      map.set(asset.category, (map.get(asset.category) || 0) + 1);
      return map;
    }, new Map());

    preferredOrder.forEach((category) => {
      if (category !== "All" && !counts.has(category)) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-chip${category === activeCategory ? " is-active" : ""}`;
      button.dataset.category = category;
      button.textContent = category;
      button.setAttribute("aria-pressed", String(category === activeCategory));
      button.addEventListener("click", () => {
        activeCategory = category;
        assetFilters.querySelectorAll(".filter-chip").forEach((chip) => {
          const selected = chip.dataset.category === activeCategory;
          chip.classList.toggle("is-active", selected);
          chip.setAttribute("aria-pressed", String(selected));
        });
        renderAssetGrid();
      });
      assetFilters.appendChild(button);
    });
  }

  function filteredAssets() {
    return assets.filter((asset) => activeCategory === "All" || asset.category === activeCategory);
  }

  function enableAssetCardMotion(card) {
    if (!finePointerQuery.matches || reduceMotionQuery.matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
      card.style.setProperty("--asset-card-ry", `${((x - .5) * 8).toFixed(2)}deg`);
      card.style.setProperty("--asset-card-rx", `${((.5 - y) * 8).toFixed(2)}deg`);
      card.style.setProperty("--asset-spot-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--asset-spot-y", `${(y * 100).toFixed(1)}%`);
    };

    card.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });

    card.addEventListener("pointerleave", () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      card.style.setProperty("--asset-card-rx", "0deg");
      card.style.setProperty("--asset-card-ry", "0deg");
      card.style.setProperty("--asset-spot-x", "50%");
      card.style.setProperty("--asset-spot-y", "50%");
    });
  }

  function renderAssetGrid() {
    const visibleAssets = filteredAssets();
    const fragment = document.createDocumentFragment();
    assetGrid.replaceChildren();

    visibleAssets.forEach((asset, visibleIndex) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "asset-card";
      card.setAttribute("aria-label", `Preview ${asset.name}`);
      const metric = assetVisualMetrics.get(asset.file) || defaultAssetMetric;
      const gridAssetScale = metric.scale * .9;
      card.style.setProperty("--asset-scale", String(gridAssetScale));
      card.style.setProperty("--asset-hover-scale", String(gridAssetScale * 1.045));
      card.style.setProperty("--asset-x", `${metric.x}%`);
      card.style.setProperty("--asset-y", `${metric.y}%`);
      card.style.setProperty("--asset-accent-rgb", getAssetAccent(asset).join(", "));

      const imageWrap = document.createElement("span");
      imageWrap.className = "asset-image-wrap";
      const image = document.createElement("img");
      image.src = previewUrl(asset.file, 512);
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      imageWrap.appendChild(image);

      const meta = document.createElement("span");
      meta.className = "asset-card-meta";
      const label = document.createElement("span");
      label.className = "asset-card-copy";
      const title = document.createElement("strong");
      title.textContent = asset.name;
      const category = document.createElement("span");
      category.className = "asset-card-category";
      category.textContent = asset.category;
      label.append(title, category);
      const arrow = document.createElement("span");
      arrow.className = "card-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "+";
      meta.append(label, arrow);

      card.append(imageWrap, meta);
      card.addEventListener("click", () => openAsset(visibleIndex, visibleAssets, card));
      enableAssetCardMotion(card);
      fragment.appendChild(card);
    });

    assetGrid.appendChild(fragment);
    resultCount.textContent = `${visibleAssets.length} asset${visibleAssets.length === 1 ? "" : "s"}`;
    emptyState.hidden = visibleAssets.length !== 0;
  }

  function assetDialogOriginRect() {
    if (!(assetDialogInvoker instanceof HTMLElement) || !assetDialogInvoker.isConnected) return null;

    const rect = assetDialogInvoker.getBoundingClientRect();
    const isVisible = rect.width > 0
      && rect.height > 0
      && rect.bottom > 0
      && rect.right > 0
      && rect.top < window.innerHeight
      && rect.left < window.innerWidth;
    return isVisible ? rect : null;
  }

  function restoreAssetDialogScroll() {
    if (Math.abs(window.scrollY - assetDialogScrollPosition.y) > 1
      || Math.abs(window.scrollX - assetDialogScrollPosition.x) > 1) {
      window.scrollTo({
        top: assetDialogScrollPosition.y,
        left: assetDialogScrollPosition.x,
        behavior: "instant",
      });
    }
  }

  function lockAssetDialogBackground() {
    document.body.style.setProperty(
      "--asset-dialog-scroll-offset",
      `${-assetDialogScrollPosition.y}px`,
    );
    document.body.classList.add("is-asset-dialog-open");
  }

  function unlockAssetDialogBackground() {
    document.body.classList.remove("is-asset-dialog-open");
    document.body.style.removeProperty("--asset-dialog-scroll-offset");
    restoreAssetDialogScroll();
  }

  function rectToDialogTransform(originRect, dialogRect) {
    const scale = Math.max(
      .06,
      Math.min(originRect.width / dialogRect.width, originRect.height / dialogRect.height),
    );
    return {
      x: originRect.left + originRect.width / 2 - (dialogRect.left + dialogRect.width / 2),
      y: originRect.top + originRect.height / 2 - (dialogRect.top + dialogRect.height / 2),
      scale,
    };
  }

  function clearAssetDialogMotionStyles() {
    if (window.gsap) {
      window.gsap.set(assetDialog, {
        clearProps: "transform,opacity,visibility,borderRadius,willChange",
      });
      return;
    }

    ["transform", "opacity", "visibility", "border-radius", "will-change"].forEach((property) => {
      assetDialog.style.removeProperty(property);
    });
  }

  function finishAssetDialogMotion(state) {
    assetDialogMotion = null;
    assetDialogMotionState = state;
    assetDialog.classList.remove("is-asset-dialog-entering", "is-asset-dialog-leaving", "is-asset-dialog-animating");
    assetDialog.removeAttribute("aria-busy");
    clearAssetDialogMotionStyles();
  }

  function animateAssetDialogOpen(originRect) {
    const gsap = window.gsap;
    if (!gsap || reduceMotionQuery.matches || !originRect) {
      finishAssetDialogMotion("open");
      assetDialog.querySelector("[data-close-dialog]")?.focus({ preventScroll: true });
      return;
    }

    const dialogRect = assetDialog.getBoundingClientRect();
    if (!dialogRect.width || !dialogRect.height) {
      finishAssetDialogMotion("open");
      assetDialog.querySelector("[data-close-dialog]")?.focus({ preventScroll: true });
      return;
    }

    const start = rectToDialogTransform(originRect, dialogRect);
    const sourceRadius = window.getComputedStyle(assetDialogInvoker).borderRadius;
    const dialogRadius = window.getComputedStyle(assetDialog).borderRadius;
    assetDialogMotionState = "opening";
    assetDialog.classList.add("is-asset-dialog-entering", "is-asset-dialog-animating");
    assetDialog.setAttribute("aria-busy", "true");
    assetDialogInvoker.classList.add("is-asset-dialog-origin");

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        if (assetDialogMotion !== timeline) return;
        finishAssetDialogMotion("open");
        assetDialog.querySelector("[data-close-dialog]")?.focus({ preventScroll: true });
      },
    });
    assetDialogMotion = timeline;
    timeline.fromTo(assetDialog, {
      x: start.x,
      y: start.y,
      scale: start.scale,
      autoAlpha: .72,
      borderRadius: sourceRadius,
      willChange: "transform, opacity",
      transformOrigin: "50% 50%",
    }, {
      x: 0,
      y: 0,
      scale: 1,
      autoAlpha: 1,
      borderRadius: dialogRadius,
      duration: .52,
      ease: "power4.out",
    });
  }

  function finalizeAssetDialogClose() {
    if (!assetDialog.open) return;
    assetDialogMotionState = "closed";
    assetDialogInvoker?.classList?.remove("is-asset-dialog-origin");
    assetDialog.close();
  }

  function requestAssetDialogClose() {
    if (!assetDialog.open || assetDialogMotionState === "closing") return;

    assetDialogImageRequest += 1;
    const gsap = window.gsap;
    if (gsap && assetDialogMotion && assetDialogMotionState === "opening") {
      assetDialogMotion.kill();
      assetDialogMotion = null;
      assetDialogMotionState = "closing";
      assetDialog.classList.remove("is-asset-dialog-entering");
      assetDialog.classList.add("is-asset-dialog-leaving", "is-asset-dialog-animating");
      assetDialog.setAttribute("aria-busy", "true");
      const closingTween = gsap.to(assetDialog, {
        autoAlpha: 0,
        duration: .22,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          if (assetDialogMotion !== closingTween) return;
          assetDialogMotion = null;
          finalizeAssetDialogClose();
        },
      });
      assetDialogMotion = closingTween;
      return;
    }

    if (assetDialogMotion) {
      assetDialogMotion.kill();
      assetDialogMotion = null;
    }
    clearAssetDialogMotionStyles();

    if (!gsap || reduceMotionQuery.matches) {
      finalizeAssetDialogClose();
      return;
    }

    assetDialogMotionState = "closing";
    assetDialog.classList.remove("is-asset-dialog-entering");
    assetDialog.classList.add("is-asset-dialog-leaving", "is-asset-dialog-animating");
    assetDialog.setAttribute("aria-busy", "true");

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        if (assetDialogMotion !== timeline) return;
        assetDialogMotion = null;
        finalizeAssetDialogClose();
      },
    });
    assetDialogMotion = timeline;

    timeline.to(assetDialog, {
      autoAlpha: 0,
      scale: .985,
      duration: .22,
      ease: "power2.in",
      willChange: "transform, opacity",
      transformOrigin: "50% 50%",
    });
  }

  async function openAsset(position, list, invoker = null) {
    if (assetDialog.open && assetDialogMotionState !== "open") return;

    previewList = list.length ? list : assets;
    previewPosition = Math.max(0, Math.min(position, previewList.length - 1));
    const shouldOpen = !assetDialog.open;
    let originRect = null;

    if (shouldOpen) {
      assetDialogInvoker = invoker instanceof HTMLElement ? invoker : document.activeElement;
      assetDialogScrollPosition = { x: window.scrollX, y: window.scrollY };
      originRect = assetDialogOriginRect();
      assetDialogMotionState = "preparing";
    }

    const imageRequest = await updateAssetDialog();
    if (!imageRequest || imageRequest !== assetDialogImageRequest) return;
    if (!shouldOpen || assetDialog.open || assetDialogMotionState !== "preparing") return;

    assetDialogMotionState = "opening";
    lockAssetDialogBackground();
    try {
      assetDialog.showModal();
    } catch (error) {
      unlockAssetDialogBackground();
      assetDialogMotionState = "closed";
      assetDialogInvoker = null;
      throw error;
    }
    restoreAssetDialogScroll();
    animateAssetDialogOpen(originRect);
  }

  async function preloadAssetDialogImage(url) {
    const preload = new Image();
    preload.decoding = "async";
    preload.src = url;

    try {
      if (typeof preload.decode === "function") {
        await preload.decode();
      } else if (!preload.complete) {
        await new Promise((resolve) => {
          preload.addEventListener("load", resolve, { once: true });
          preload.addEventListener("error", resolve, { once: true });
        });
      }
    } catch (error) {
      if (!preload.complete) {
        await new Promise((resolve) => {
          preload.addEventListener("load", resolve, { once: true });
          preload.addEventListener("error", resolve, { once: true });
        });
      }
    }

    return preload;
  }

  async function updateAssetDialog() {
    const asset = previewList[previewPosition];
    if (!asset) return 0;

    const request = ++assetDialogImageRequest;
    const url = assetUrl(asset.file);
    const metric = assetVisualMetrics.get(asset.file) || defaultAssetMetric;
    const positionLabel = `${previewPosition + 1} / ${previewList.length}`;
    const preload = await preloadAssetDialogImage(url);
    if (request !== assetDialogImageRequest) return 0;

    const image = document.getElementById("dialogImage");
    assetDialog.style.setProperty("--asset-accent-rgb", getAssetAccent(asset).join(", "));
    image.alt = asset.name;
    image.style.setProperty("--asset-scale", String(metric.scale));
    image.style.setProperty("--asset-hover-scale", String(metric.scale * 1.035));
    image.style.setProperty("--asset-x", `${metric.x}%`);
    image.style.setProperty("--asset-y", `${metric.y}%`);
    document.getElementById("dialogCategory").textContent = asset.category;
    document.getElementById("assetDialogTitle").textContent = asset.name;
    document.getElementById("dialogFile").textContent = asset.file;
    document.getElementById("dialogDimensions").textContent = preload.naturalWidth
      ? `${preload.naturalWidth} × ${preload.naturalHeight} px`
      : "Unavailable";
    document.getElementById("dialogDownload").href = url;
    document.getElementById("dialogDownload").download = asset.file;
    document.getElementById("dialogPosition").textContent = positionLabel;
    image.src = url;
    return request;
  }

  function movePreview(direction) {
    if (assetDialogMotionState !== "open" || !previewList.length) return;
    previewPosition = (previewPosition + direction + previewList.length) % previewList.length;
    updateAssetDialog();
  }

  function initDetailRouteDocks() {
    const trackers = ["color", "typography"].map((route) => {
      const page = document.querySelector(`[data-page="${route}"]`);
      const current = page?.querySelector(".detail-jump-current");
      const sections = page
        ? [...page.querySelectorAll("[data-dock-title]")]
        : [];
      const dock = page?.querySelector(".detail-route-dock");
      const jumpDock = page?.querySelector(".detail-jump-dock");
      const toggle = jumpDock?.querySelector(".detail-jump-toggle");
      const items = jumpDock
        ? [...jumpDock.querySelectorAll("[data-detail-scroll-target]")]
        : [];
      return {
        route,
        current,
        sections,
        dock,
        jumpDock,
        toggle,
        items,
        scrollIntent: null,
        scrollIntentStartedAt: 0,
        scrollEndTimer: 0,
        scrollEndListener: null,
      };
    }).filter((tracker) => tracker.current && tracker.sections.length);

    const labelFor = (tracker, section) => {
      const item = tracker.items.find((candidate) => candidate.dataset.detailScrollTarget === section.id);
      return item?.textContent?.trim() || section.dataset.dockTitle || tracker.current.textContent;
    };

    const setExpanded = (tracker, expanded) => {
      if (!tracker.jumpDock || !tracker.toggle) return;
      tracker.jumpDock.classList.toggle("is-expanded", expanded);
      tracker.toggle.setAttribute("aria-expanded", String(expanded));
    };

    const setActive = (tracker, section) => {
      if (!section) return;
      tracker.current.textContent = labelFor(tracker, section);
      tracker.items.forEach((item) => {
        const isActive = item.dataset.detailScrollTarget === section.id;
        item.classList.toggle("is-active", isActive);
        if (isActive) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
    };

    const cancelScrollCompletion = (tracker) => {
      if (tracker.scrollEndTimer) {
        window.clearTimeout(tracker.scrollEndTimer);
        tracker.scrollEndTimer = 0;
      }
      if (tracker.scrollEndListener) {
        window.removeEventListener("scrollend", tracker.scrollEndListener);
        tracker.scrollEndListener = null;
      }
    };

    const cancelScrollIntent = (tracker) => {
      cancelScrollCompletion(tracker);
      tracker.scrollIntent = null;
      tracker.scrollIntentStartedAt = 0;
    };

    const scrollMarginFor = (target) => {
      const value = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);
      return Number.isFinite(value) ? value : 0;
    };

    const completeScrollIntent = (tracker, target) => {
      if (tracker.scrollIntent !== target) return;
      const minimumSettleTime = 420;
      const elapsed = window.performance.now() - tracker.scrollIntentStartedAt;
      if (elapsed < minimumSettleTime) {
        cancelScrollCompletion(tracker);
        tracker.scrollEndTimer = window.setTimeout(
          () => completeScrollIntent(tracker, target),
          minimumSettleTime - elapsed,
        );
        return;
      }
      cancelScrollCompletion(tracker);
      if (document.body.dataset.route !== tracker.route) {
        cancelScrollIntent(tracker);
        return;
      }
      const correction = target.getBoundingClientRect().top - scrollMarginFor(target);
      if (Math.abs(correction) > 1) {
        window.scrollBy({ top: correction, behavior: "auto" });
      }
      setActive(tracker, target);
      target.focus({ preventScroll: true });
      tracker.scrollIntent = null;
      tracker.scrollIntentStartedAt = 0;
      update(tracker.route);
    };

    collapseDetailRouteDocks = () => trackers.forEach((tracker) => setExpanded(tracker, false));

    trackers.forEach((tracker) => {
      tracker.toggle?.addEventListener("click", () => {
        setExpanded(tracker, !tracker.jumpDock.classList.contains("is-expanded"));
      });

      tracker.jumpDock?.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !tracker.jumpDock.classList.contains("is-expanded")) return;
        event.preventDefault();
        setExpanded(tracker, false);
        tracker.toggle?.focus({ preventScroll: true });
      });

      tracker.items.forEach((item) => {
        item.addEventListener("click", () => {
          const target = document.getElementById(item.dataset.detailScrollTarget || "");
          if (!target) return;
          cancelScrollIntent(tracker);
          tracker.scrollIntent = target;
          tracker.scrollIntentStartedAt = window.performance.now();
          setActive(tracker, target);
          setExpanded(tracker, false);
          tracker.toggle?.focus({ preventScroll: true });
          const behavior = reduceMotionQuery.matches ? "auto" : "smooth";
          window.requestAnimationFrame(() => {
            if (tracker.scrollIntent !== target) return;
            if (behavior === "smooth") {
              tracker.scrollEndListener = () => completeScrollIntent(tracker, target);
              window.addEventListener("scrollend", tracker.scrollEndListener, { once: true });
              tracker.scrollEndTimer = window.setTimeout(
                () => completeScrollIntent(tracker, target),
                2600,
              );
            } else {
              tracker.scrollEndTimer = window.setTimeout(
                () => completeScrollIntent(tracker, target),
                0,
              );
            }
            const top = window.scrollY + target.getBoundingClientRect().top - scrollMarginFor(target);
            window.scrollTo({
              top: Math.max(0, top),
              behavior,
            });
          });
        });
      });

      setActive(tracker, tracker.sections[0]);
      setExpanded(tracker, false);
    });

    let frame = 0;
    const update = (requestedRoute = document.body.dataset.route) => {
      const tracker = trackers.find(({ route }) => route === requestedRoute);
      if (!tracker) return;
      if (tracker.scrollIntent) {
        setActive(tracker, tracker.scrollIntent);
        return;
      }
      const dockLead = (tracker.dock?.getBoundingClientRect().bottom || 0) + 16;
      const sectionLead = Number.parseFloat(window.getComputedStyle(tracker.sections[0]).scrollMarginTop) + 4;
      const activationLine = Math.max(
        dockLead,
        Number.isFinite(sectionLead) ? sectionLead : 0,
        Math.min(window.innerHeight * .36, 320),
      );
      let activeSection = tracker.sections[0];
      tracker.sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= activationLine) activeSection = section;
      });
      setActive(tracker, activeSection);
    };

    const schedule = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
        if (event?.type === "scroll") {
          const tracker = trackers.find(({ route }) => route === document.body.dataset.route);
          const focusedInMenu = tracker?.jumpDock?.contains(document.activeElement)
            && document.activeElement !== tracker.toggle;
          if (tracker && !focusedInMenu) setExpanded(tracker, false);
        }
      });
    };

    const cancelActiveScrollIntent = () => {
      const tracker = trackers.find(({ route }) => route === document.body.dataset.route);
      if (tracker?.scrollIntent) cancelScrollIntent(tracker);
    };

    syncDetailRouteDock = (route = document.body.dataset.route) => {
      trackers.forEach((tracker) => {
        if (tracker.route !== route && tracker.scrollIntent) cancelScrollIntent(tracker);
      });
      update(route);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("wheel", cancelActiveScrollIntent, { passive: true });
    window.addEventListener("touchstart", cancelActiveScrollIntent, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (["PageUp", "PageDown", "Home", "End", "Escape"].includes(event.key)) {
        cancelActiveScrollIntent();
      }
    });
  }

  function initColorSpectrumStory() {
    const section = document.getElementById("color-spectrum");
    const stage = section?.querySelector(".color-spectrum-stage");
    const bands = stage ? [...stage.querySelectorAll(".color-story-band")] : [];
    if (!section || bands.length < 2) return;

    let initialized = false;
    let mode = "idle";
    let timeline = null;
    let fallbackFrame = 0;
    let fallbackBound = false;

    const stickyTop = () => {
      const value = Number.parseFloat(window.getComputedStyle(stage).top);
      return Number.isFinite(value) ? value : 0;
    };

    const paintFallback = () => {
      fallbackFrame = 0;
      if (mode !== "fallback" || document.body.dataset.route !== "color") return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = Math.max(0, Math.min(1, (stickyTop() - rect.top) / travel));
      bands.slice(1).forEach((band, index) => {
        const localProgress = Math.max(0, Math.min(1, progress * (bands.length - 1) - index));
        band.style.transform = `translate3d(${(-102 * (1 - localProgress)).toFixed(3)}%, 0, 0)`;
      });
    };

    const scheduleFallback = () => {
      if (mode === "fallback" && !fallbackFrame) {
        fallbackFrame = window.requestAnimationFrame(paintFallback);
      }
    };

    const bindFallback = () => {
      if (fallbackBound) return;
      fallbackBound = true;
      window.addEventListener("scroll", scheduleFallback, { passive: true });
      window.addEventListener("resize", scheduleFallback, { passive: true });
    };

    const unbindFallback = () => {
      if (!fallbackBound) return;
      fallbackBound = false;
      window.removeEventListener("scroll", scheduleFallback);
      window.removeEventListener("resize", scheduleFallback);
      if (fallbackFrame) window.cancelAnimationFrame(fallbackFrame);
      fallbackFrame = 0;
    };

    const destroyTimeline = () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      timeline = null;
    };

    const resetBandTransforms = () => {
      bands.slice(1).forEach((band) => band.style.removeProperty("transform"));
    };

    const configure = () => {
      destroyTimeline();
      unbindFallback();
      section.classList.remove("is-static", "is-gsap-ready", "uses-scroll-fallback");
      resetBandTransforms();

      if (reduceMotionQuery.matches) {
        mode = "static";
        section.classList.add("is-static");
        bands.slice(1).forEach((band) => {
          band.style.transform = "translate3d(0, 0, 0)";
        });
        return;
      }

      if (window.gsap && window.ScrollTrigger) {
        mode = "gsap";
        window.gsap.registerPlugin(window.ScrollTrigger);
        section.classList.add("is-gsap-ready");
        window.gsap.set(bands.slice(1), { xPercent: -102 });
        timeline = window.gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: {
            id: "color-spectrum-story",
            trigger: section,
            start: () => `top top+=${stickyTop()}`,
            end: () => {
              const bottomGap = Math.max(0, window.innerHeight - stickyTop() - stage.offsetHeight);
              return `bottom bottom-=${bottomGap}`;
            },
            scrub: .35,
            invalidateOnRefresh: true,
          },
        });
        bands.slice(1).forEach((band, index) => {
          timeline.to(band, { xPercent: 0 }, index);
        });
        window.requestAnimationFrame(() => window.ScrollTrigger.refresh());
        return;
      }

      mode = "fallback";
      section.classList.add("uses-scroll-fallback");
      if (document.body.dataset.route === "color") {
        bindFallback();
        paintFallback();
      }
    };

    const setRouteActive = (route) => {
      const active = route === "color";
      if (active && !initialized) {
        initialized = true;
        configure();
      }
      if (!initialized) return;

      if (mode === "gsap" && timeline?.scrollTrigger) {
        if (active) {
          timeline.scrollTrigger.enable(false, true);
          window.requestAnimationFrame(() => window.ScrollTrigger.refresh());
        } else {
          timeline.scrollTrigger.disable(false);
        }
      } else if (mode === "fallback") {
        if (active) {
          bindFallback();
          paintFallback();
        } else {
          unbindFallback();
        }
      }
    };

    syncColorSpectrumStoryRoute = setRouteActive;

    const handleMotionPreference = () => {
      if (!initialized) return;
      configure();
      setRouteActive(document.body.dataset.route);
    };
    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", handleMotionPreference);
    } else {
      reduceMotionQuery.addListener(handleMotionPreference);
    }
  }

  function initTypographyExperience() {
    const page = document.querySelector('[data-page="typography"]');
    if (!page) return;
    const field = page.querySelector("[data-type-field]");
    const inspector = page.querySelector("[data-type-inspector]");
    const contextRows = [...page.querySelectorAll("#type-context [data-type-context-row]")];
    if (field) {
      const stage = field.querySelector("[data-type-field-stage]");
      const postureControl = field.querySelector("[data-type-posture]");
      const status = field.querySelector("[data-type-field-status]");
      const specimenElement = field.querySelector("[data-type-field-specimen]");
      const weightControls = [...field.querySelectorAll("[data-type-field-weight]")];
      const weightSamples = [...field.querySelectorAll("[data-type-field-weight-sample]")];
      const sizeControl = field.querySelector("[data-type-field-size]");
      const sizeOutput = field.querySelector("[data-type-field-size-output]");
      const trackingControl = field.querySelector("[data-type-field-tracking]");
      const trackingOutput = field.querySelector("[data-type-field-tracking-output]");
      const leadingControl = field.querySelector("[data-type-field-leading]");
      const leadingOutput = field.querySelector("[data-type-field-leading-output]");
      const lens = field.querySelector("[data-type-lens]");
      const lensGlyph = field.querySelector("[data-type-lens-glyph]");
      const defaultSpecimen = "Pay the\nTikTok Way!";
      const weights = [300, 400, 500, 600, 700, 800, 900];
      const weightNames = new Map([
        [300, "Light"],
        [400, "Regular"],
        [500, "Medium"],
        [600, "Semibold"],
        [700, "Bold"],
        [800, "Extra bold"],
        [900, "Black"],
      ]);
      const state = {
        text: specimenElement?.innerText || defaultSpecimen,
        weightIndex: 3,
        size: 168,
        posture: "normal",
        tracking: -.04,
        leading: 1,
        engaged: false,
        inspecting: false,
        point: { x: .52, y: .38 },
      };
      const gsap = window.gsap;
      const lensMotion = gsap && lens
        ? {
            x: gsap.quickTo(lens, "x", { duration: .16, ease: "power2.out" }),
            y: gsap.quickTo(lens, "y", { duration: .16, ease: "power2.out" }),
          }
        : null;
      let fieldBounds = null;
      let pointerFrame = 0;
      let pendingPointer = null;
      let activePointer = null;

      const currentWeight = () => weights[state.weightIndex] || 600;
      const currentWeightName = () => weightNames.get(currentWeight()) || "Semibold";
      const currentPostureName = () => state.posture === "italic" ? "Italic" : "Upright";
      const formatTracking = () => {
        const magnitude = Math.abs(state.tracking).toFixed(2).replace(/^0/, "");
        return `${state.tracking < 0 ? "−" : state.tracking > 0 ? "+" : ""}${magnitude}`;
      };
      const syncRange = (control, output, value, label) => {
        if (!control) return;
        const min = Number.parseFloat(control.min || "0");
        const max = Number.parseFloat(control.max || "100");
        const progress = clamp((value - min) / Math.max(1, max - min), 0, 1);
        control.value = String(value);
        control.parentElement?.style.setProperty(
          "--thumb-position",
          `calc(${(progress * 100).toFixed(3)}% + ${((.5 - progress) * 32).toFixed(3)}px)`,
        );
        if (output) output.value = label;
      };

      const positionLens = (immediate = false) => {
        if (!stage || !lens) return;
        fieldBounds = fieldBounds || stage.getBoundingClientRect();
        const lensRadius = lens.offsetWidth / 2 + 12;
        const x = clamp(state.point.x * fieldBounds.width, lensRadius, fieldBounds.width - lensRadius);
        const y = clamp(state.point.y * fieldBounds.height, lensRadius, fieldBounds.height - lensRadius);
        if (gsap && (immediate || reduceMotionQuery.matches)) {
          gsap.set(lens, { x, y, xPercent: -50, yPercent: -50 });
        } else if (lensMotion) {
          lensMotion.x(x);
          lensMotion.y(y);
        } else {
          lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
      };

      const paintField = (immediate = false) => {
        if (!stage) return;
        const weight = currentWeight();
        const specimen = state.text || defaultSpecimen;
        const glyphs = [...specimen].filter((glyph) => glyph !== "\n");
        const comparisonSample = "ag";
        const detailGlyph = glyphs[clamp(Math.floor(state.point.x * glyphs.length), 0, Math.max(0, glyphs.length - 1))] || "a";
        const lensSize = clamp(state.size * 1.45, 170, stage.clientWidth < 600 ? 176 : 260);

        field.dataset.posture = state.posture;
        field.classList.toggle("is-engaged", state.engaged);
        field.classList.toggle("is-inspecting", state.inspecting);
        field.style.setProperty("--field-x", `${(state.point.x * 100).toFixed(2)}%`);
        field.style.setProperty("--field-y", `${(state.point.y * 100).toFixed(2)}%`);
        field.style.setProperty("--field-size", String(state.size));
        field.style.setProperty("--field-tracking", `${state.tracking}em`);
        field.style.setProperty("--field-leading", String(state.leading));
        field.style.setProperty("--lens-font-size", `${Math.round(lensSize)}px`);
        field.style.setProperty("--lens-drift", "0px");

        if (specimenElement) {
          if (document.activeElement !== specimenElement && specimenElement.innerText !== specimen) {
            specimenElement.textContent = specimen;
          }
          specimenElement.style.fontWeight = String(weight);
          specimenElement.style.fontStyle = state.posture;
          specimenElement.style.letterSpacing = `${state.tracking}em`;
          specimenElement.style.lineHeight = String(state.leading);
        }

        if (lensGlyph) {
          lensGlyph.textContent = detailGlyph;
          lensGlyph.style.fontWeight = String(weight);
          lensGlyph.style.fontStyle = state.posture;
          lensGlyph.style.letterSpacing = `${state.tracking}em`;
        }
        weightSamples.forEach((sample) => {
          sample.textContent = comparisonSample;
        });
        positionLens(immediate);
        if (status) status.value = `${currentWeightName()} ${weight} · ${state.size}px · ${currentPostureName()}`;
        postureControl?.setAttribute("aria-pressed", String(state.posture === "italic"));
        weightControls.forEach((control) => {
          const active = Number.parseInt(control.dataset.typeFieldWeight || "", 10) === weight;
          control.setAttribute("aria-checked", String(active));
          control.tabIndex = active ? 0 : -1;
        });
        syncRange(sizeControl, sizeOutput, state.size, String(state.size));
        syncRange(trackingControl, trackingOutput, Math.round(state.tracking * 100), formatTracking());
        syncRange(leadingControl, leadingOutput, Math.round(state.leading * 100), state.leading.toFixed(2).replace(/0$/, ""));
        sizeControl?.setAttribute("aria-valuetext", `${state.size} pixels`);
        trackingControl?.setAttribute("aria-valuetext", `${formatTracking()} em`);
        leadingControl?.setAttribute("aria-valuetext", `${state.leading.toFixed(2)} times`);
      };

      const requestFont = () => {
        const declaration = `${state.posture} ${currentWeight()} 32px "TikTok Sans"`;
        document.fonts?.load(declaration, state.text || defaultSpecimen).then(() => paintField(true)).catch(() => {});
      };

      const setWeightIndex = (index, options = {}) => {
        const previousWeightIndex = state.weightIndex;
        state.weightIndex = clamp(index, 0, weights.length - 1);
        paintField(Boolean(options.immediate));
        if (gsap && specimenElement && previousWeightIndex !== state.weightIndex && !reduceMotionQuery.matches) {
          gsap.fromTo(
            specimenElement,
            { autoAlpha: .35 },
            { autoAlpha: 1, duration: .18, ease: "power2.out", overwrite: "auto", clearProps: "opacity,visibility" },
          );
        }
        requestFont();
        if (options.focus) weightControls[state.weightIndex]?.focus({ preventScroll: true });
      };

      const setSize = (size, options = {}) => {
        state.size = clamp(Math.round(size / 4) * 4, 72, 220);
        paintField(Boolean(options.immediate));
      };

      const setPosture = (posture) => {
        state.posture = posture === "italic" ? "italic" : "normal";
        paintField();
        requestFont();
      };

      const setTracking = (hundredths) => {
        state.tracking = clamp(Math.round(hundredths), -8, 4) / 100;
        paintField();
      };

      const setLeading = (hundredths) => {
        state.leading = clamp(Math.round(hundredths / 5) * 5, 80, 150) / 100;
        paintField();
      };

      const bindRangeInteraction = (control, applyValue) => {
        if (!control) return;
        const min = Number.parseFloat(control.min || "0");
        const max = Number.parseFloat(control.max || "100");
        const step = Math.max(Number.parseFloat(control.step || "1"), Number.EPSILON);
        let rangePointer = null;

        const apply = (rawValue) => {
          const steps = Math.round((rawValue - min) / step);
          const nextValue = clamp(min + steps * step, min, max);
          control.value = String(nextValue);
          applyValue(nextValue);
        };
        const applyFromPoint = (clientX) => {
          const bounds = control.getBoundingClientRect();
          const thumbSize = 32;
          const usableWidth = Math.max(1, bounds.width - thumbSize);
          const progress = clamp((clientX - bounds.left - thumbSize / 2) / usableWidth, 0, 1);
          apply(min + progress * (max - min));
        };
        const finishPointer = (event) => {
          if (rangePointer !== event.pointerId) return;
          if (control.hasPointerCapture?.(event.pointerId)) {
            control.releasePointerCapture(event.pointerId);
          }
          rangePointer = null;
        };

        control.addEventListener("pointerdown", (event) => {
          if (!event.isPrimary || event.button > 0) return;
          event.preventDefault();
          rangePointer = event.pointerId;
          control.focus({ preventScroll: true });
          control.setPointerCapture?.(event.pointerId);
          applyFromPoint(event.clientX);
        });
        control.addEventListener("pointermove", (event) => {
          if (rangePointer !== event.pointerId) return;
          event.preventDefault();
          applyFromPoint(event.clientX);
        });
        control.addEventListener("pointerup", finishPointer);
        control.addEventListener("pointercancel", finishPointer);
        control.addEventListener("lostpointercapture", (event) => {
          if (rangePointer === event.pointerId) rangePointer = null;
        });
        control.addEventListener("keydown", (event) => {
          let nextValue = Number.parseFloat(control.value);
          if (["ArrowLeft", "ArrowDown"].includes(event.key)) nextValue -= step;
          else if (["ArrowRight", "ArrowUp"].includes(event.key)) nextValue += step;
          else if (event.key === "PageDown") nextValue -= step * 5;
          else if (event.key === "PageUp") nextValue += step * 5;
          else if (event.key === "Home") nextValue = min;
          else if (event.key === "End") nextValue = max;
          else return;
          event.preventDefault();
          apply(nextValue);
        });
      };

      const updateFromPoint = (clientX, clientY, inspect = false) => {
        if (!stage) return;
        fieldBounds = fieldBounds || stage.getBoundingClientRect();
        if (!fieldBounds.width || !fieldBounds.height) return;
        const x = clamp((clientX - fieldBounds.left) / fieldBounds.width, 0, 1);
        const y = clamp((clientY - fieldBounds.top) / fieldBounds.height, 0, 1);
        state.point = { x, y };
        if (inspect) state.inspecting = true;
        paintField();
      };

      const schedulePointerUpdate = (event, inspect = false) => {
        pendingPointer = { x: event.clientX, y: event.clientY, inspect };
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = 0;
          if (!pendingPointer) return;
          const point = pendingPointer;
          pendingPointer = null;
          updateFromPoint(point.x, point.y, point.inspect);
        });
      };

      stage?.addEventListener("pointerenter", (event) => {
        fieldBounds = stage.getBoundingClientRect();
        state.engaged = true;
        paintField();
      });
      stage?.addEventListener("pointermove", (event) => {
        if (event.target instanceof Element && event.target.closest("[data-type-field-specimen]")) return;
        if (event.pointerType === "touch" && activePointer !== event.pointerId) return;
        schedulePointerUpdate(event, activePointer === event.pointerId);
      });
      stage?.addEventListener("pointerleave", () => {
        if (activePointer !== null) return;
        state.engaged = false;
        state.inspecting = false;
        paintField();
      });
      stage?.addEventListener("pointerdown", (event) => {
        if (!event.isPrimary) return;
        if (event.target instanceof Element && event.target.closest("[data-type-field-specimen]")) return;
        activePointer = event.pointerId;
        state.engaged = true;
        state.inspecting = true;
        if (event.pointerType !== "touch") stage.setPointerCapture?.(event.pointerId);
        schedulePointerUpdate(event, true);
      });
      stage?.addEventListener("pointerup", (event) => {
        if (activePointer !== event.pointerId) return;
        activePointer = null;
        state.inspecting = false;
        paintField();
      });
      stage?.addEventListener("pointercancel", () => {
        activePointer = null;
        state.inspecting = false;
        paintField();
      });
      stage?.addEventListener("focus", () => {
        state.engaged = true;
        paintField();
      });
      stage?.addEventListener("blur", () => {
        state.engaged = false;
        state.inspecting = false;
        paintField();
      });
      stage?.addEventListener("keydown", (event) => {
        if (event.target instanceof Element && event.target.closest("[contenteditable], input, textarea")) return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Escape"].includes(event.key)) {
          event.preventDefault();
        }
        if (event.key === "ArrowLeft") setWeightIndex(state.weightIndex - 1);
        if (event.key === "ArrowRight") setWeightIndex(state.weightIndex + 1);
        if (event.key === "ArrowUp") setSize(state.size + 4);
        if (event.key === "ArrowDown") setSize(state.size - 4);
        if (event.key === "Enter" || event.key === " ") {
          state.inspecting = !state.inspecting;
          paintField();
        }
        if (event.key === "Escape") {
          state.inspecting = false;
          paintField();
        }
        if (event.key.toLowerCase() === "i") setPosture(state.posture === "italic" ? "normal" : "italic");
      });

      specimenElement?.addEventListener("input", () => {
        state.text = specimenElement.innerText.replace(/\r/g, "").slice(0, 80);
        paintField();
        requestFont();
      });
      specimenElement?.addEventListener("blur", () => {
        if (state.text.trim()) {
          paintField();
          return;
        }
        state.text = defaultSpecimen;
        specimenElement.textContent = state.text;
        paintField();
      });
      postureControl?.addEventListener("click", () => {
        setPosture(state.posture === "italic" ? "normal" : "italic");
      });
      weightControls.forEach((control, index) => {
        control.addEventListener("click", () => setWeightIndex(index));
        control.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + weights.length) % weights.length;
          if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % weights.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = weights.length - 1;
          setWeightIndex(next, { focus: true });
        });
      });
      sizeControl?.addEventListener("input", () => setSize(Number.parseFloat(sizeControl.value)));
      trackingControl?.addEventListener("input", () => setTracking(Number.parseFloat(trackingControl.value)));
      leadingControl?.addEventListener("input", () => setLeading(Number.parseFloat(leadingControl.value)));
      bindRangeInteraction(sizeControl, setSize);
      bindRangeInteraction(trackingControl, setTracking);
      bindRangeInteraction(leadingControl, setLeading);

      const refreshField = () => {
        fieldBounds = stage?.getBoundingClientRect() || null;
        paintField(true);
      };
      if ("ResizeObserver" in window && stage) {
        new ResizeObserver(refreshField).observe(stage);
      } else {
        window.addEventListener("resize", refreshField, { passive: true });
      }
      const handleFieldMotionPreference = () => paintField(true);
      if (typeof reduceMotionQuery.addEventListener === "function") {
        reduceMotionQuery.addEventListener("change", handleFieldMotionPreference);
      } else {
        reduceMotionQuery.addListener(handleFieldMotionPreference);
      }
      document.fonts?.ready.then(refreshField).catch(() => {});
      paintField(true);
      requestFont();

      syncTypographyExperienceRoute = (route) => {
        if (route !== "typography") return;
        window.requestAnimationFrame(refreshField);
      };
    }
    if (inspector) {
      const canvas = inspector.querySelector("[data-type-canvas]");
      const canvasWrap = inspector.querySelector("[data-type-canvas-wrap]");
      const meta = inspector.querySelector("[data-type-inspector-meta]");
      const textControl = inspector.querySelector("[data-type-inspector-text]");
      const sizeControl = inspector.querySelector("[data-type-inspector-size]");
      const sizeOutput = inspector.querySelector("[data-type-inspector-size-output]");
      const weightSelect = inspector.querySelector("[data-type-inspector-weight-select]");
      const weightControls = [...inspector.querySelectorAll("[data-type-inspector-weight]")];
      const styleControls = [...inspector.querySelectorAll("[data-type-inspector-style]")];
      const guideControl = inspector.querySelector("[data-type-inspector-guides]");
      const viewControls = [...inspector.querySelectorAll("[data-type-view]")];
      const viewPanels = [...inspector.querySelectorAll("[data-type-panel]")];
      const glyphControls = [...inspector.querySelectorAll("[data-type-glyph]")];
      const sizePresets = [...inspector.querySelectorAll("[data-type-size-preset]")];
      const familySamples = [...inspector.querySelectorAll("[data-type-family-sample]")];
      const scaleSamples = [...inspector.querySelectorAll("[data-type-scale-sample]")];
      const weightNames = new Map([
        [300, "Light"],
        [400, "Regular"],
        [500, "Medium"],
        [600, "Semibold"],
        [700, "Bold"],
        [800, "Extra bold"],
        [900, "Black"],
      ]);
      const state = {
        text: textControl?.value || "agR1@&",
        size: Number.parseInt(sizeControl?.value || "168", 10),
        weight: Number.parseInt(weightSelect?.value || "400", 10),
        style: styleControls.find((control) => control.checked)?.value || "normal",
        guides: guideControl?.checked ?? true,
        view: viewControls.find((control) => control.getAttribute("aria-selected") === "true")?.dataset.typeView || "detail",
      };
      let drawFrame = 0;

      const fontDeclaration = () =>
        `${state.style === "italic" ? "italic" : "normal"} ${state.weight} ${state.size}px "TikTok Sans", Arial, sans-serif`;

      const drawGuide = (context, width, y, label, color) => {
        context.save();
        context.beginPath();
        context.setLineDash([5, 5]);
        context.moveTo(24, Math.round(y) + .5);
        context.lineTo(width - 24, Math.round(y) + .5);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = color;
        context.font = '600 10px "TikTok Sans", Arial, sans-serif';
        context.textBaseline = "bottom";
        context.fillText(label, 28, y - 6);
        context.restore();
      };

      const drawSpecimen = () => {
        drawFrame = 0;
        if (!canvas || !canvasWrap || state.view !== "detail") return;
        const bounds = canvasWrap.getBoundingClientRect();
        const width = Math.round(bounds.width);
        const height = Math.round(bounds.height);
        if (width < 2 || height < 2) return;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(width * pixelRatio);
        const pixelHeight = Math.round(height * pixelRatio);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }
        const context = canvas.getContext("2d");
        if (!context) return;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);
        context.font = fontDeclaration();
        context.textBaseline = "alphabetic";
        const sample = state.text || "agR1@&";
        const metrics = context.measureText(sample);
        const capMetrics = context.measureText("H");
        const xMetrics = context.measureText("x");
        const ascent = metrics.actualBoundingBoxAscent || state.size * .75;
        const descent = metrics.actualBoundingBoxDescent || state.size * .2;
        const capHeight = capMetrics.actualBoundingBoxAscent || state.size * .72;
        const xHeight = xMetrics.actualBoundingBoxAscent || state.size * .52;
        const baseline = state.guides
          ? Math.min(height - 54 - descent, Math.max(capHeight + 68, height * .69))
          : height / 2 + (ascent - descent) / 2;
        const left = Math.max(36, (width - metrics.width) / 2);

        if (state.guides) {
          drawGuide(context, width, baseline - capHeight, "CAP HEIGHT", "rgba(255,255,255,.34)");
          drawGuide(context, width, baseline - xHeight, "X-HEIGHT", "rgba(237,187,232,.5)");
          drawGuide(context, width, baseline, "BASELINE", "rgba(45,204,211,.72)");
          if (descent > 1) {
            drawGuide(context, width, baseline + descent, "DESCENDER", "rgba(255,255,255,.24)");
          }
        }

        context.font = fontDeclaration();
        context.textBaseline = "alphabetic";
        context.fillStyle = "#ffffff";
        context.fillText(sample, left, baseline);

        if (state.guides) {
          const boxLeft = left - (metrics.actualBoundingBoxLeft || 0);
          const boxWidth = (metrics.actualBoundingBoxLeft || 0) + (metrics.actualBoundingBoxRight || metrics.width);
          context.strokeStyle = "rgba(241,32,74,.54)";
          context.lineWidth = 1;
          context.setLineDash([3, 4]);
          context.strokeRect(boxLeft + .5, baseline - ascent + .5, Math.max(1, boxWidth), Math.max(1, ascent + descent));
          context.setLineDash([]);
        }
      };

      const scheduleSpecimenDraw = () => {
        if (!drawFrame) drawFrame = window.requestAnimationFrame(drawSpecimen);
      };

      const requestFontAndDraw = () => {
        scheduleSpecimenDraw();
        const requestedFont = `${state.style === "italic" ? "italic" : "normal"} ${state.weight} 32px "TikTok Sans"`;
        document.fonts?.load(requestedFont, state.text || "agR1@&").then(scheduleSpecimenDraw).catch(() => {});
      };

      const paintInspectorMeta = () => {
        if (!meta) return;
        const weightName = weightNames.get(state.weight) || "Regular";
        const styleName = state.style === "italic" ? "Italic" : "Upright";
        if (state.view === "weights") {
          meta.textContent = `7 weights · ${styleName} · Common sample`;
        } else if (state.view === "sizes") {
          meta.textContent = `8 size steps · ${weightName} ${state.weight} · ${styleName}`;
        } else {
          meta.textContent = `${weightName} · ${state.weight} · ${state.size}px${state.style === "italic" ? " · Italic" : ""}`;
        }
      };

      const syncInspector = () => {
        const sample = state.text || "agR1@&";
        const weightName = weightNames.get(state.weight) || "Regular";
        paintInspectorMeta();
        if (sizeOutput) {
          sizeOutput.value = `${state.size}px`;
          sizeOutput.textContent = `${state.size}px`;
        }
        if (sizeControl) {
          sizeControl.value = String(state.size);
          sizeControl.setAttribute("aria-valuetext", `${state.size} pixel font size`);
        }
        if (weightSelect) weightSelect.value = String(state.weight);
        weightControls.forEach((control) => {
          control.checked = Number.parseInt(control.value, 10) === state.weight;
        });
        styleControls.forEach((control) => {
          control.checked = control.value === state.style;
        });
        if (guideControl) guideControl.checked = state.guides;
        inspector.dataset.guides = String(state.guides);
        inspector.style.setProperty("--inspector-style", state.style);
        inspector.style.setProperty("--inspector-weight", String(state.weight));
        familySamples.forEach((sampleNode) => {
          sampleNode.textContent = sample;
        });
        scaleSamples.forEach((sampleNode) => {
          sampleNode.textContent = sample;
        });
        glyphControls.forEach((control) => {
          control.setAttribute("aria-pressed", String(control.dataset.typeGlyph === state.text));
        });
        sizePresets.forEach((control) => {
          const active = Number.parseInt(control.dataset.typeSizePreset || "", 10) === state.size;
          control.classList.toggle("is-active", active);
          control.setAttribute("aria-pressed", String(active));
        });
        if (canvas) {
          canvas.setAttribute(
            "aria-label",
            `TikTok Sans ${weightName} ${state.weight}${state.style === "italic" ? " italic" : " upright"} at ${state.size} pixels. Sample: ${sample}.`,
          );
        }
        requestFontAndDraw();
      };

      const setView = (view, focusTab = false) => {
        const nextView = viewPanels.some((panel) => panel.dataset.typePanel === view) ? view : "detail";
        state.view = nextView;
        inspector.dataset.view = nextView;
        viewControls.forEach((control) => {
          const active = control.dataset.typeView === nextView;
          control.setAttribute("aria-selected", String(active));
          control.tabIndex = active ? 0 : -1;
          if (active && focusTab) control.focus({ preventScroll: true });
        });
        viewPanels.forEach((panel) => {
          panel.hidden = panel.dataset.typePanel !== nextView;
        });
        paintInspectorMeta();
        if (nextView === "detail") scheduleSpecimenDraw();
      };

      viewControls.forEach((control, index) => {
        control.addEventListener("click", () => setView(control.dataset.typeView || "detail"));
        control.addEventListener("keydown", (event) => {
          let nextIndex = -1;
          if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % viewControls.length;
          if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + viewControls.length) % viewControls.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = viewControls.length - 1;
          if (nextIndex < 0) return;
          event.preventDefault();
          setView(viewControls[nextIndex].dataset.typeView || "detail", true);
        });
      });

      textControl?.addEventListener("input", () => {
        state.text = textControl.value;
        syncInspector();
      });
      textControl?.addEventListener("blur", () => {
        if (textControl.value.trim()) return;
        textControl.value = "agR1@&";
        state.text = textControl.value;
        syncInspector();
      });
      sizeControl?.addEventListener("input", () => {
        state.size = Number.parseInt(sizeControl.value, 10);
        syncInspector();
      });
      weightSelect?.addEventListener("change", () => {
        state.weight = Number.parseInt(weightSelect.value, 10);
        syncInspector();
      });
      weightControls.forEach((control) => {
        control.addEventListener("change", () => {
          if (!control.checked) return;
          state.weight = Number.parseInt(control.value, 10);
          syncInspector();
        });
      });
      styleControls.forEach((control) => {
        control.addEventListener("change", () => {
          if (!control.checked) return;
          state.style = control.value;
          syncInspector();
        });
      });
      guideControl?.addEventListener("change", () => {
        state.guides = guideControl.checked;
        syncInspector();
      });
      glyphControls.forEach((control) => {
        control.addEventListener("click", () => {
          state.text = control.dataset.typeGlyph || "a";
          if (textControl) textControl.value = state.text;
          syncInspector();
        });
      });
      sizePresets.forEach((control) => {
        control.addEventListener("click", () => {
          const size = Number.parseInt(control.dataset.typeSizePreset || "", 10);
          if (!Number.isFinite(size)) return;
          state.size = clamp(size, 32, 220);
          syncInspector();
        });
      });

      if ("ResizeObserver" in window && canvasWrap) {
        new ResizeObserver(scheduleSpecimenDraw).observe(canvasWrap);
      } else {
        window.addEventListener("resize", scheduleSpecimenDraw, { passive: true });
      }
      document.fonts?.ready.then(scheduleSpecimenDraw).catch(() => {});
      setView(state.view);
      syncInspector();

      syncTypographyExperienceRoute = (route) => {
        if (route !== "typography") return;
        window.requestAnimationFrame(scheduleSpecimenDraw);
      };
    }

    contextRows.forEach((row) => {
      const sizeControl = row.querySelector("[data-type-size]");
      const sizeOutput = row.querySelector("[data-type-size-output]");
      const weightControls = [...row.querySelectorAll('[data-type-weight][type="radio"]')];
      const preview = row.querySelector("[data-type-context-preview]");
      let sizeFrame = 0;

      const paintSize = () => {
        sizeFrame = 0;
        if (!sizeControl || !sizeOutput) return;
        const minimum = Number.parseFloat(sizeControl.min);
        const maximum = Number.parseFloat(sizeControl.max);
        const value = Number.parseFloat(sizeControl.value);
        if (![minimum, maximum, value].every(Number.isFinite)) return;
        const progress = maximum === minimum ? 0 : clamp((value - minimum) / (maximum - minimum), 0, 1);
        const label = `${Number.isInteger(value) ? value : value.toFixed(1)}px`;
        const thumbOffset = 9 - progress * 18;
        row.style.setProperty("--preview-size", label);
        row.style.setProperty("--range-progress", `${progress * 100}%`);
        row.style.setProperty(
          "--range-thumb-position",
          `calc(${progress * 100}% + ${thumbOffset.toFixed(2)}px)`,
        );
        sizeOutput.value = label;
        sizeOutput.textContent = label;
        sizeControl.setAttribute("aria-valuetext", `${label} font size`);
      };

      const scheduleSizePaint = () => {
        if (!sizeFrame) sizeFrame = window.requestAnimationFrame(paintSize);
      };

      const paintWeight = (control) => {
        if (!control?.checked) return;
        const weight = control.dataset.typeWeight || control.value;
        if (weight) row.style.setProperty("--preview-weight", weight);
      };

      sizeControl?.addEventListener("input", scheduleSizePaint);
      weightControls.forEach((control) => {
        control.addEventListener("change", () => paintWeight(control));
      });
      preview?.addEventListener("blur", () => {
        const text = preview.textContent.replace(/\u200B/g, "").trim();
        if (text) return;
        preview.textContent = preview.dataset.defaultCopy || "";
      });

      paintSize();
      const initialWeight = weightControls.find((control) => control.checked) || weightControls[0];
      if (initialWeight && !initialWeight.checked) initialWeight.checked = true;
      paintWeight(initialWeight);
    });
  }

  function initRandomTypePoster() {
    const card = document.querySelector(".portal-type");
    const glyph = card?.querySelector(".type-poster-glyph");
    const meta = card?.querySelector(".type-poster-meta");
    if (!card || !glyph || !meta) return;

    const states = [
      { weight: 300, italic: false, skew: 0, width: 0.97 },
      { weight: 900, italic: false, skew: 0, width: 1.02 },
      { weight: 400, italic: true, skew: -8, width: 0.96 },
      { weight: 700, italic: true, skew: -11, width: 1.03 },
      { weight: 500, italic: false, skew: 1, width: 0.99 },
      { weight: 800, italic: false, skew: -2, width: 1.01 },
    ];
    let timer = 0;
    let timerDeadline = 0;
    let remainingDelay = null;
    let animation = null;
    let animationSuspended = false;
    let active = false;
    let visible = false;
    let previousIndex = -1;

    const reset = () => {
      window.clearTimeout(timer);
      timer = 0;
      remainingDelay = null;
      animation?.cancel();
      animation = null;
      animationSuspended = false;
      glyph.style.fontWeight = "900";
      glyph.style.fontStyle = "normal";
      glyph.style.transform = "skewX(0deg) scaleX(1)";
      meta.textContent = "TikTok Sans · 900";
      meta.style.fontWeight = "700";
      meta.style.fontStyle = "normal";
    };

    const schedule = (delay) => {
      remainingDelay = delay;
      if (!active || !visible) return;
      timerDeadline = performance.now() + delay;
      timer = window.setTimeout(() => {
        timer = 0;
        remainingDelay = null;
        step();
      }, delay);
    };

    const step = () => {
      if (!active || !visible) return;
      let nextIndex = Math.floor(Math.random() * states.length);
      if (nextIndex === previousIndex) nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (states.length - 1))) % states.length;
      previousIndex = nextIndex;
      const next = states[nextIndex];
      const duration = 150 + Math.random() * 190;
      const computed = getComputedStyle(glyph);
      const fromTransform = computed.transform === "none" ? "skewX(0deg) scaleX(1)" : computed.transform;
      const targetTransform = `skewX(${next.skew}deg) scaleX(${next.width})`;

      animation?.cancel();
      animationSuspended = false;
      glyph.style.fontWeight = String(next.weight);
      glyph.style.fontStyle = next.italic ? "italic" : "normal";
      glyph.style.transform = targetTransform;
      meta.textContent = `TikTok Sans · ${next.weight}${next.italic ? " Italic" : ""}`;
      meta.style.fontWeight = String(Math.max(500, next.weight));
      meta.style.fontStyle = next.italic ? "italic" : "normal";
      if (!reduceMotionQuery.matches) {
        animation = glyph.animate([
          { fontWeight: computed.fontWeight, transform: fromTransform },
          { fontWeight: String(next.weight), transform: targetTransform },
        ], { duration, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" });
      }
      schedule(duration + 40 + Math.random() * 110);
    };

    const start = () => {
      if (active) return;
      active = true;
      if (visible) step();
      else remainingDelay = 0;
    };
    const stop = () => {
      active = false;
      previousIndex = -1;
      reset();
    };

    watchPortalActivity(card, (nextVisible) => {
      visible = nextVisible;
      if (!visible) {
        if (timer) {
          remainingDelay = Math.max(0, timerDeadline - performance.now());
          window.clearTimeout(timer);
          timer = 0;
        }
        if (animation?.playState === "running") {
          animation.pause();
          animationSuspended = true;
        }
      } else if (active) {
        if (animationSuspended) {
          animation.play();
          animationSuspended = false;
        }
        if (remainingDelay !== null) schedule(remainingDelay);
        else step();
      }
    });

    card.addEventListener("pointerenter", start);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focus", start);
    card.addEventListener("blur", stop);
  }

  function initPortalLogoSpotlight() {
    document.querySelectorAll(".portal-logo, .logo-stage").forEach((card) => {
      let frame = 0;
      let nextX = "50%";
      let nextY = "50%";

      const syncPointer = (event) => {
        const rect = card.getBoundingClientRect();
        nextX = `${((event.clientX - rect.left) / rect.width) * 100}%`;
        nextY = `${((event.clientY - rect.top) / rect.height) * 100}%`;
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          card.style.setProperty("--logo-pointer-x", nextX);
          card.style.setProperty("--logo-pointer-y", nextY);
          frame = 0;
        });
      };

      card.addEventListener("pointerenter", syncPointer, { passive: true });
      card.addEventListener("pointermove", syncPointer, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--logo-pointer-x");
        card.style.removeProperty("--logo-pointer-y");
      });
    });
  }

  function initLogoSectionNav() {
    const triggers = [...document.querySelectorAll(".logo-scroll-trigger[data-scroll-target]")];
    const localLinks = [...document.querySelectorAll(".logo-local-link[data-scroll-target]")];
    const jumpDock = document.querySelector(".logo-jump-dock");
    const routeDock = jumpDock?.closest(".logo-route-dock");
    const jumpToggle = jumpDock?.querySelector(".logo-jump-toggle");
    const jumpCurrent = jumpDock?.querySelector(".logo-jump-current");
    const jumpItems = jumpDock
      ? [...jumpDock.querySelectorAll(".logo-scroll-trigger[data-scroll-target]")]
      : [];
    const visibleJumpPairs = () => jumpItems
      .map((item) => ({
        item,
        target: document.getElementById(item.dataset.scrollTarget),
      }))
      .filter(({ item, target }) => Boolean(target) && !item.hidden && !target.hidden);
    if (!triggers.length) return;
    let manualActiveUntil = 0;
    let jumpScrollFrame = 0;
    let jumpScrollStopTimer = 0;

    const setJumpExpanded = (expanded) => {
      if (!jumpDock || !jumpToggle) return;
      jumpDock.classList.toggle("is-expanded", expanded);
      jumpToggle.setAttribute("aria-expanded", String(expanded));
    };

    const hasFocusedExpandedJumpItem = () => {
      if (!jumpDock?.classList.contains("is-expanded")) return false;
      const activeElement = document.activeElement;
      return visibleJumpPairs().some(({ item }) => item === activeElement || item.contains(activeElement));
    };

    const jumpLabelFor = (targetId) => {
      const item = jumpItems.find((candidate) => candidate.dataset.scrollTarget === targetId);
      const label = item?.querySelector("strong")?.textContent || item?.textContent;
      return label?.trim() || "";
    };

    const setJumpCurrent = (targetId) => {
      if (!jumpCurrent) return;
      const label = jumpLabelFor(targetId);
      if (label) jumpCurrent.textContent = label;
    };

    collapseLogoJumpDock = () => {
      if (jumpScrollFrame) window.cancelAnimationFrame(jumpScrollFrame);
      jumpScrollFrame = 0;
      window.clearTimeout(jumpScrollStopTimer);
      jumpScrollStopTimer = 0;
      jumpDock?.classList.remove("is-scrolling", "is-scroll-collapsed");
      setJumpExpanded(false);
    };

    resetLogoJumpDock = () => {
      collapseLogoJumpDock();
      const firstTargetId = visibleJumpPairs()[0]?.target.id;
      if (firstTargetId) setJumpCurrent(firstTargetId);
    };

    if (jumpDock && jumpToggle) {
      const initiallyExpanded = jumpDock.classList.contains("is-expanded")
        || jumpToggle.getAttribute("aria-expanded") === "true";
      setJumpExpanded(initiallyExpanded);

      jumpToggle.addEventListener("click", () => {
        jumpDock.classList.remove("is-scroll-collapsed");
        setJumpExpanded(!jumpDock.classList.contains("is-expanded"));
      });

      jumpDock.addEventListener("pointerleave", () => {
        jumpDock.classList.remove("is-scroll-collapsed");
      });

      jumpDock.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !jumpDock.classList.contains("is-expanded")) return;
        event.preventDefault();
        setJumpExpanded(false);
        jumpToggle.focus({ preventScroll: true });
      });

      window.addEventListener("scroll", () => {
        if (document.body.dataset.route !== "logo") return;

        if (!jumpScrollFrame) {
          jumpScrollFrame = window.requestAnimationFrame(() => {
            jumpScrollFrame = 0;
            if (hasFocusedExpandedJumpItem()) {
              jumpDock.classList.remove("is-scrolling");
            } else {
              jumpDock.classList.add("is-scrolling", "is-scroll-collapsed");
              setJumpExpanded(false);
            }

            const visibleTargets = visibleJumpPairs().map(({ target }) => target);
            let activeTarget = visibleTargets[0];
            const atPageEnd = window.scrollY + window.innerHeight
              >= document.documentElement.scrollHeight - 8;
            if (atPageEnd) {
              activeTarget = visibleTargets.at(-1) || activeTarget;
            } else {
              const activationLine = routeDock?.getBoundingClientRect().bottom + 16
                || Math.min(window.innerHeight * 0.42, 320);
              visibleTargets.forEach((target) => {
                if (target.getBoundingClientRect().top <= activationLine) activeTarget = target;
              });
            }
            if (activeTarget?.id) setActiveTarget(activeTarget.id);
          });
        }

        window.clearTimeout(jumpScrollStopTimer);
        jumpScrollStopTimer = window.setTimeout(() => {
          jumpDock.classList.remove("is-scrolling");
          jumpScrollStopTimer = 0;
        }, 160);
      }, { passive: true });
    }

    const localTargetFor = (targetId) => {
      if (localLinks.some((link) => link.dataset.scrollTarget === targetId)) return targetId;
      if (targetId === "logo-clear-space" || targetId === "logo-resources") return "logo-primary-lockup";
      return null;
    };

    const setActiveTarget = (targetId) => {
      const localTargetId = localTargetFor(targetId);
      if (localTargetId) {
        localLinks.forEach((link) => {
          const isActive = link.dataset.scrollTarget === localTargetId;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
      jumpItems.forEach((item) => {
        const isActive = !item.hidden && item.dataset.scrollTarget === targetId;
        item.classList.toggle("is-active", isActive);
        if (isActive) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
      setJumpCurrent(targetId);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const targetId = trigger.dataset.scrollTarget;
        const target = document.getElementById(targetId);
        if (!target || trigger.hidden || target.hidden) return;

        manualActiveUntil = performance.now() + 1400;
        setActiveTarget(targetId);
        if (jumpDock?.contains(trigger)) setJumpExpanded(false);
        target.focus?.({ preventScroll: true });
        target.scrollIntoView({
          behavior: reduceMotionQuery.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    });

    if (!("IntersectionObserver" in window)) return;

    const observedTargets = [...new Set([...localLinks, ...jumpItems].map((link) => link.dataset.scrollTarget))]
      .map((targetId) => document.getElementById(targetId))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      if (document.body.dataset.route !== "logo") return;
      if (performance.now() < manualActiveUntil) return;
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting && !entry.target.hidden)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (visibleEntry?.target?.id) setActiveTarget(visibleEntry.target.id);
    }, {
      rootMargin: "-15% 0px -45% 0px",
      threshold: 0,
    });

    observedTargets.forEach((target) => observer.observe(target));
  }

  function initLogoClearspaceTabs() {
    const tablist = document.querySelector(".logo-clearspace-tabs");
    const switcher = tablist?.closest(".logo-clearspace-switcher");
    const tabs = tablist
      ? [...tablist.querySelectorAll('[role="tab"][data-clearspace-target]')]
      : [];
    if (!tabs.length) return;

    const panelFor = (tab) => {
      const target = tab.dataset.clearspaceTarget;
      const panelId = tab.getAttribute("aria-controls") || `clearspace-${target}-panel`;
      return document.getElementById(panelId);
    };

    const activateTab = (activeTab, moveFocus = false) => {
      const previousIndex = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
      const nextIndex = tabs.indexOf(activeTab);
      if (switcher && previousIndex !== -1 && previousIndex !== nextIndex) {
        switcher.dataset.clearspaceDirection = nextIndex > previousIndex ? "forward" : "backward";
      }

      tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        const panel = panelFor(tab);
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (panel) {
          panel.classList.toggle("is-active", isActive);
          panel.hidden = !isActive;
        }
      });

      if (moveFocus) activeTab.focus({ preventScroll: true });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("pointerenter", (event) => {
        if (!finePointerQuery.matches || event.pointerType === "touch") return;
        activateTab(tab);
      });
      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      });
    });

    const initialTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true")
      || tabs.find((tab) => tab.classList.contains("is-active"))
      || tabs[0];
    activateTab(initialTab);
  }

  function initLogoConsumerCardMotion() {
    if (!finePointerQuery.matches || reduceMotionQuery.matches) return;

    document.querySelectorAll(".logo-system-grid-consumer .logo-system-card").forEach((card) => {
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;

      const render = () => {
        frame = 0;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height));
        card.style.setProperty("--card-rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
        card.style.setProperty("--card-ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
        card.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
      };

      card.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(render);
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        card.style.setProperty("--card-rx", "0deg");
        card.style.setProperty("--card-ry", "0deg");
        card.style.removeProperty("--spot-x");
        card.style.removeProperty("--spot-y");
      }, { passive: true });
    });
  }

  function initLogoBusinessShowcase() {
    const showcase = document.querySelector(".logo-business-showcase");
    if (!showcase) return;

    const setExpanded = (expanded, restoreFocus = false) => {
      showcase.classList.toggle("is-expanded", expanded);
      showcase.setAttribute("aria-expanded", String(expanded));
      if (restoreFocus) showcase.focus({ preventScroll: true });
    };

    const initialExpanded = showcase.classList.contains("is-expanded")
      || showcase.getAttribute("aria-expanded") === "true";
    setExpanded(initialExpanded);

    collapseLogoBusinessShowcase = () => setExpanded(false);

    showcase.addEventListener("click", () => {
      setExpanded(!showcase.classList.contains("is-expanded"));
    });

    showcase.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !showcase.classList.contains("is-expanded")) return;
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false, true);
    });
  }

  let pendingRouteTransition = 0;
  const navigateFromTrigger = (trigger) => {
    const nextRoute = trigger.dataset.route || "home";
    const activeLogoRail = document.querySelector('[data-page="logo"].is-active .logo-guide-rail');
    const localNav = activeLogoRail?.querySelector(".logo-local-nav");
    const shouldCollapseLogoRail = document.body.dataset.route === "logo"
      && nextRoute !== "logo"
      && trigger.closest(".logo-guide-rail")
      && localNav
      && !reduceMotionQuery.matches;

    const commitNavigation = () => navigate(
      nextRoute,
      true,
      trigger.dataset.homeMode || "",
      trigger.dataset.logoBrand || "",
    );

    if (!shouldCollapseLogoRail) {
      pendingRouteTransition += 1;
      commitNavigation();
      return;
    }

    const transitionToken = ++pendingRouteTransition;
    const openHeight = Math.ceil(localNav.getBoundingClientRect().height || localNav.scrollHeight);
    localNav.style.setProperty("--logo-local-open-height", `${openHeight}px`);
    // Commit the open state before collapsing so the max-height transition is visible.
    localNav.getBoundingClientRect();
    localNav.inert = true;
    localNav.setAttribute("aria-hidden", "true");
    activeLogoRail.classList.add("is-collapsing-local");

    let completed = false;
    const finish = () => {
      if (completed || transitionToken !== pendingRouteTransition) return;
      completed = true;
      window.clearTimeout(fallbackTimer);
      localNav.removeEventListener("transitionend", handleTransitionEnd);
      commitNavigation();
      window.requestAnimationFrame(() => {
        activeLogoRail.classList.remove("is-collapsing-local");
        localNav.inert = false;
        localNav.removeAttribute("aria-hidden");
        localNav.style.removeProperty("--logo-local-open-height");
      });
    };
    const handleTransitionEnd = (event) => {
      if (event.target === localNav && event.propertyName === "max-height") finish();
    };
    const fallbackTimer = window.setTimeout(finish, 310);
    localNav.addEventListener("transitionend", handleTransitionEnd);
  };

  document.querySelectorAll(".route-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => navigateFromTrigger(trigger));
  });

  document.querySelectorAll(".locked-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLockedDialog(trigger.dataset.lockedSection || "This chapter", trigger);
    });
  });

  canvasFisheyeToggle?.addEventListener("click", () => {
    setCanvasFisheye(!canvasFisheyeEnabled);
  });
  homeViewToggle.addEventListener("click", () => {
    setHomeMode(homePage.classList.contains("is-bento") ? "canvas" : "bento");
  });

  document.querySelectorAll(".bento-return").forEach((button) => {
    button.addEventListener("click", () => {
      navigate("home", true, "bento");
      focusBentoEntry();
    });
  });

  document.querySelectorAll("[data-copy-color][data-hex]").forEach((swatch) => {
    swatch.addEventListener("click", () => copyText(swatch.dataset.hex, `Copied ${swatch.dataset.hex}`));
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    activeCategory = "All";
    buildFiltersAfterReset();
    renderAssetGrid();
  });

  function buildFiltersAfterReset() {
    assetFilters.replaceChildren();
    buildFilters();
  }

  document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", requestAssetDialogClose));
  document.querySelectorAll("[data-close-locked]").forEach((button) => button.addEventListener("click", () => lockedDialog.close()));
  document.getElementById("previousAsset").addEventListener("click", () => movePreview(-1));
  document.getElementById("nextAsset").addEventListener("click", () => movePreview(1));

  assetDialog.addEventListener("click", (event) => {
    if (event.target === assetDialog) requestAssetDialogClose();
  });

  assetDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestAssetDialogClose();
  });

  assetDialog.addEventListener("close", () => {
    const returnTarget = assetDialogInvoker;
    assetDialogImageRequest += 1;
    document.getElementById("dialogImage").removeAttribute("src");
    assetDialogMotion?.kill();
    assetDialogMotion = null;
    assetDialogMotionState = "closed";
    assetDialog.classList.remove("is-asset-dialog-entering", "is-asset-dialog-leaving", "is-asset-dialog-animating");
    assetDialog.removeAttribute("aria-busy");
    clearAssetDialogMotionStyles();
    returnTarget?.classList?.remove("is-asset-dialog-origin");
    unlockAssetDialogBackground();
    returnTarget?.focus?.({ preventScroll: true });
    window.requestAnimationFrame(restoreAssetDialogScroll);
    assetDialogInvoker = null;
  });

  lockedDialog.addEventListener("click", (event) => {
    if (event.target === lockedDialog) lockedDialog.close();
  });

  lockedDialog.addEventListener("close", () => {
    const returnTarget = lockedDialogInvoker;
    unlockLockedDialogBackground();
    returnTarget?.focus?.({ preventScroll: true });
    window.requestAnimationFrame(restoreLockedDialogScroll);
    lockedDialogInvoker = null;
  });

  document.addEventListener("keydown", (event) => {
    if (canvasFocusedPosition !== null) {
      if (event.key === "Escape") clearCanvasFocus(true);
      return;
    }
    if (assetDialog.open) {
      if (assetDialogMotionState !== "open") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePreview(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        movePreview(1);
      }
    }
  });

  window.addEventListener("popstate", (event) => {
    const route = getRouteFromHash();
    const logoBrand = route === "logo"
      ? (event.state?.logoBrand || getLogoBrandFromHash())
      : "";
    navigate(route, false, event.state?.homeMode || "", logoBrand);
    if (route === "home") setHomeMode(event.state?.homeMode === "bento" ? "bento" : "canvas");
  });

  buildAssetCanvas();
  buildPortalStack();
  document.querySelectorAll(".portal-color, .portal-voice").forEach((card) => watchPortalActivity(card));
  initPortalLogoSpotlight();
  initLogoSectionNav();
  initLogoClearspaceTabs();
  initLogoConsumerCardMotion();
  initLogoBusinessShowcase();
  initDetailRouteDocks();
  initColorSpectrumStory();
  buildFilters();
  renderAssetGrid();
  initTypographyExperience();
  initRandomTypePoster();
  setCanvasFisheye(canvasFisheyeEnabled, false);
  setHomeMode("canvas");
  navigate(getRouteFromHash(), false, "", getLogoBrandFromHash());
})();
