function avatarSvgTemplate(parts) {
    return `
        <svg class="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${parts.background}
            ${parts.hairBack}
            ${parts.top}
            <rect x="44" y="58" width="12" height="14" fill="${parts.skin}"/>
            <circle cx="30" cy="46" r="4" fill="${parts.skin}"/>
            <circle cx="70" cy="46" r="4" fill="${parts.skin}"/>
            <ellipse cx="50" cy="45" rx="20" ry="22" fill="${parts.skin}"/>
            <circle cx="42" cy="44" r="2.3" fill="#2b2b2b"/>
            <circle cx="58" cy="44" r="2.3" fill="#2b2b2b"/>
            <circle cx="37" cy="51" r="3" fill="#ff8fa3" fill-opacity="0.45"/>
            <circle cx="63" cy="51" r="3" fill="#ff8fa3" fill-opacity="0.45"/>
            <path d="M43 53 Q50 59 57 53" stroke="#2b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/>
            ${parts.hair}
            ${parts.glasses}
            ${parts.hat}
            ${parts.accessory}
            ${parts.flag}
        </svg>
    `;
}

function flagPinTemplate(flagUrl) {
    return `
        <rect x="62" y="80" width="16" height="11" fill="#ffffff"/>
        <image href="${flagUrl}" x="63" y="81" width="14" height="9" preserveAspectRatio="none"/>
    `;
}

function shopPageTemplate(previewHtml, coins, buyAreaHtml, tabsHtml, itemsHtml, flagPickerHtml) {
    return `
        <section class="panel">
            <div class="title-row">
                <h1>Avatar &amp; Shop</h1>
                ${backButtonTemplate()}
            </div>
            <div class="shop-layout">
                <div class="shop-preview">
                    ${previewHtml}
                    <span class="coin-amount"><span class="coin-icon"></span>${coins} Coins</span>
                    <div class="shop-buy-area">${buyAreaHtml}</div>
                </div>
                <div class="shop-main">
                    <div class="shop-tabs">${tabsHtml}</div>
                    ${flagPickerHtml}
                    <div class="shop-items">${itemsHtml}</div>
                </div>
            </div>
            <p class="shop-hint">Coins gibt es für jedes beendete Spiel (5), Erfolge (25 / 50 / 100), Tages-Aufgaben (bis 10 pro Aufgabe, +20 für alle drei) und jeden Level-Aufstieg (50).</p>
        </section>
    `;
}

function shopTabTemplate(slot, activeClass) {
    return `<button class="shop-tab ${activeClass}" onclick="selectShopSlot('${slot.key}')">${slot.title}</button>`;
}

function shopItemTemplate(item, previewHtml, stateText, stateClass) {
    return `
        <button class="shop-item ${stateClass}" onclick="tryShopItem('${item.id}')">
            ${previewHtml}
            <span class="shop-item-name">${item.name}</span>
            <span class="shop-item-state">${stateText}</span>
        </button>
    `;
}

function shopBuyTemplate(names, total, disabledText, hintText) {
    return `
        <p class="shop-buy-text">Anprobiert: <b>${names}</b></p>
        <p class="shop-buy-hint">${hintText}</p>
        <button class="button" onclick="buyPreviewOutfit()" ${disabledText}>Kaufen für ${total} Coins</button>
        <button class="button button-secondary" onclick="resetPreviewOutfit()">Zurücksetzen</button>
    `;
}

function shopSavedTemplate() {
    return `<p class="shop-buy-text">Alles angezogen, was du besitzt.</p>`;
}

function shopFlagPickerTemplate(optionsHtml) {
    return `
        <label class="setting shop-flag-picker">Neue Flagge anprobieren (${FLAG_PRICE} Coins)
            <select id="flag-select" onchange="tryShopItem(this.value)">
                <option value="">Land auswählen ...</option>
                ${optionsHtml}
            </select>
        </label>
    `;
}
