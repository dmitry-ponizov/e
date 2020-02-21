const iOSAppID = {
    'CNDA': '808215470',
    'USA': '407558537'
}

const kochavaSmartLink = {
    'CNDA': '5ceea3249c15c',
    'USA': '5cb731aec69db'
}

function createKochavaImg(servicingCountry) {
    var kochavaImg = new Image(1, 1)
    kochavaImg.src = 'https://smart.link/' + kochavaSmartLink[servicingCountry];
    kochavaImg.style = 'position: absolute;';
    kochavaImg.alt = '';
    document.getElementsByTagName('body')[0].appendChild(kochavaImg);
}

function createIOSMetaTag(servicingCountry) {
    const smartBanner = document.createElement('meta');
    smartBanner.name = 'apple-itunes-app';
    smartBanner.content = 'app-id=' + iOSAppID[servicingCountry];
    smartBanner.alt = '';
    document.getElementsByTagName('head')[0].appendChild(smartBanner);
}

function createManifestLink() {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/ease-ui/web-app-manifest.json';
    manifest.crossOrigin = 'use-credentials';
    document.getElementsByTagName('head')[0].appendChild(manifest);
}

function createSmartBanner() {
    // check that language is set and the app is not in a mobile webview
    if ((window.EASE_SC === 'USA' || window.EASE_SC === 'CNDA') && !(window.easeweb && (window.easeweb.ios || window.easeweb.android))) {
        createIOSMetaTag(window.EASE_SC);
        createManifestLink();
        createKochavaImg(window.EASE_SC);
    }
}

createSmartBanner();