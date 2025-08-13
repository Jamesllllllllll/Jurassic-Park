(function () {
  if (!window.gsap) return;
  window.gsap.registerPlugin(window.TextPlugin);

  function getLineHeightPx(el) {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    if (!Number.isNaN(lh)) return lh;
    const fs = parseFloat(cs.fontSize) || 16;
    return fs * 1.4;
  }

  function computeMaxVisibleLines(overlayEl, contentEl) {
    const h = overlayEl.clientHeight;
    const lh = getLineHeightPx(contentEl);
    return Math.max(1, Math.floor(h / lh));
  }

  function appendLine(contentEl, line) {
    contentEl.appendChild(document.createTextNode(line + "\n"));
  }

  function ensureNewline(contentEl) {
    const txt = contentEl.textContent || "";
    if (!txt.endsWith("\n")) {
      appendLine(contentEl, "");
    }
  }

  function createTypeLineTween(contentEl, line, timePerChar) {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.textContent = "";
    return window.gsap.to(span, {
      duration: Math.max(0.2, line.length * (timePerChar || 0.04)),
      text: line,
      ease: "none",
      data: { type: "typing", line },
      onStart: () => {
        // Append the span only when the tween actually starts so it doesn't
        // appear before intervening lines (like PERMISSION DENIED) are added.
        contentEl.appendChild(span);
      },
      onComplete: () => {
        span.replaceWith(line + "\n");
      },
    });
  }

  // Expose helper for debugging/inspection (and provide a plural alias)
  window.createTypeLineTween = createTypeLineTween;
  window.createTypeLineTweens = createTypeLineTween;

  // (Deprecated) createTypeLineSequence — replaced by createTypeLineTween usage

  window.triggerBSOD = function triggerBSOD() {
    const overlay = document.querySelector(".bsod-overlay");
    if (!overlay) return;
    const contentEl = overlay.querySelector(".content");
    // Ensure magic word image exists and is hidden initially
    let magicImg = overlay.querySelector(".magic-word-img");
    if (!magicImg) {
      magicImg = document.createElement("img");
      magicImg.className = "magic-word-img";
      magicImg.alt = "You didn't say the magic word";
      magicImg.src = "assets/images/magic-word.gif";
      overlay.appendChild(magicImg);
    }
    magicImg.style.display = "none";

    if (window.bsodTimeline) {
      try {
        window.bsodTimeline.kill();
      } catch (_) {}
      window.bsodTimeline = null;
    }
    if (window.bsodInterval) {
      try {
        clearInterval(window.bsodInterval);
      } catch (_) {}
      window.bsodInterval = null;
    }
    // Ensure any previous looping audio is stopped when restarting BSOD
    if (window.bsodMagicAudio) {
      try {
        window.bsodMagicAudio.pause();
        window.bsodMagicAudio.currentTime = 0;
      } catch (_) {}
      window.bsodMagicAudio = null;
    }
    window.gsap.killTweensOf([overlay, contentEl]);

    overlay.style.display = "block";
    overlay.setAttribute("aria-hidden", "false");

    // Initialize content before building timeline to avoid race conditions
    contentEl.textContent = "";
    appendLine(contentEl, "Jurassic Park, System Security Interface");
    appendLine(contentEl, "Version 4.0.5, Alpha E");
    appendLine(contentEl, "Ready...");

    const tl = window.gsap.timeline({ defaults: { overwrite: false } });
    tl.set(overlay, { opacity: 0 })
      .to(overlay, { opacity: 1, duration: 0.15, ease: "none" })
      .add(createTypeLineTween(contentEl, "> access main program", 0.05), ">1")
      .add(() => appendLine(contentEl, "access: PERMISSION DENIED."), ">+=.8")
      .add(() => ensureNewline(contentEl), ">")
      .add(createTypeLineTween(contentEl, "> access main security", 0.05), ">1")
      .add(() => appendLine(contentEl, "access: PERMISSION DENIED."), ">+=0.8")
      .add(() => ensureNewline(contentEl), ">")
      .add(createTypeLineTween(contentEl, "> access main program grid", 0.05), ">1")
      .add(() => appendLine(contentEl, "access: PERMISSION DENIED....AND...."), ">+=0.8")
      .to({}, { duration: 1.2 })
      .add(() => appendLine(contentEl, "YOU DIDN'T SAY THE MAGIC WORD!"), ">+=0.8")
      .to({}, { duration: 0.8 })
      .call(() => {
        // Show the magic word image when repeating lines start
        if (magicImg) magicImg.style.display = "block";

        // Play "ah ah ah" sound when repeating lines begin (loop until cleared)
        try {
          if (window.bsodMagicAudio) {
            try {
              window.bsodMagicAudio.pause();
              window.bsodMagicAudio.currentTime = 0;
            } catch (_) {}
          }
          const magicAudio = new Audio('assets/sounds/jurassic-park-ah-ah-ah.mp3');
          magicAudio.preload = 'auto';
          magicAudio.loop = true;
          magicAudio.play().catch(() => {
            const handler = () => {
              magicAudio.play().finally(() => {
                document.removeEventListener('click', handler);
                document.removeEventListener('keydown', handler);
                document.removeEventListener('touchstart', handler);
              });
            };
            document.addEventListener('click', handler, { once: true });
            document.addEventListener('keydown', handler, { once: true });
            document.addEventListener('touchstart', handler, { once: true });
          });
          window.bsodMagicAudio = magicAudio;
        } catch (_) {}
        const maxLines = computeMaxVisibleLines(overlay, contentEl);
        const phrase = "YOU DIDN'T SAY THE MAGIC WORD!";

        function currentLinesArray() {
          const txt = contentEl.textContent;
          return txt.endsWith("\n") ? txt.slice(0, -1).split("\n") : txt.split("\n");
        }

        window.bsodInterval = setInterval(() => {
          appendLine(contentEl, phrase);

          const lines = currentLinesArray();
          if (lines.length > maxLines) {
            const trimmed = lines.slice(lines.length - maxLines);
            contentEl.textContent = trimmed.join("\n") + "\n";
          }

          const visible = currentLinesArray();
          if (visible.length >= maxLines && visible.every((l) => l === phrase)) {
            clearInterval(window.bsodInterval);
            window.bsodInterval = null;
          }
        }, 200);
      });

    window.bsodTimeline = tl;
    return tl;
  };

  window.clearBSOD = function clearBSOD() {
    const overlay = document.querySelector(".bsod-overlay");
    if (!overlay) return;
    const contentEl = overlay.querySelector(".content");
    if (window.bsodTimeline) {
      try {
        window.bsodTimeline.kill();
      } catch (_) {}
      window.bsodTimeline = null;
    }
    if (window.bsodInterval) {
      try {
        clearInterval(window.bsodInterval);
      } catch (_) {}
      window.bsodInterval = null;
    }
    if (window.bsodMagicAudio) {
      try {
        window.bsodMagicAudio.pause();
        window.bsodMagicAudio.currentTime = 0;
      } catch (_) {}
      window.bsodMagicAudio = null;
    }
    window.gsap.killTweensOf([overlay, contentEl]);
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
    if (contentEl) contentEl.textContent = "";
  };
})();


