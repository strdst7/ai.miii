(function () {
  const links = [
    ["Website", "existingPortfolio"],
    ["GitHub", "github"],
    ["LinkedIn", "linkedin"],
    ["Writing", "devto"],
  ];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  fetch("/api/public/portfolio-profile")
    .then((response) => {
      if (!response.ok) throw new Error("Profile data unavailable");
      return response.json();
    })
    .then((profile) => {
      const root = element("div", "mia-library-profile");
      const toggle = element("button", "mia-profile-toggle", `${profile.preferredName} · ${profile.roleTitle}`);
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "mia-profile-panel");

      const panel = element("section", "mia-profile-panel");
      panel.id = "mia-profile-panel";
      panel.setAttribute("aria-label", `${profile.fullName} profile`);
      panel.hidden = true;

      const header = element("div", "mia-profile-heading");
      const title = element("h2", "", profile.fullName);
      const close = element("button", "mia-profile-close", "Close");
      close.type = "button";
      close.setAttribute("aria-label", "Close profile");
      header.append(title, close);
      panel.append(
        header,
        element("p", "mia-profile-role", `${profile.roleTitle} · ${profile.company}`),
        element("p", "mia-profile-location", profile.location),
        element("p", "mia-profile-bio", profile.bioShort)
      );

      const navigation = element("nav", "mia-profile-links");
      navigation.setAttribute("aria-label", "Mia's links");
      for (const [label, key] of links) {
        const url = profile.links[key];
        if (!url || !/^https:\/\//.test(url)) continue;
        const anchor = element("a", "", label);
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        navigation.append(anchor);
      }
      panel.append(navigation);

      function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        if (open) close.focus();
        else toggle.focus();
      }
      toggle.addEventListener("click", () => setOpen(panel.hidden));
      close.addEventListener("click", () => setOpen(false));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) setOpen(false);
      });

      root.append(toggle, panel);
      document.body.append(root);
    })
    .catch(() => {
      // The archive still works when profile data is unavailable.
    });
})();
