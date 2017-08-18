// ==UserScript==
// @name         Swap out FB images for cat(s)!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use babel compiler
// @author       aleph-naught2tog
// @include      https://www.facebook.com/*
// @run-at       document-end
// ==/UserScript==

let replacementImg =
    'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg';


let userImageSelector = 'div.mtm img';
let sharedImageSelector = 'div._6ks img';
let sharedLinkImageSelector = 'div._5cq3 img';
let pagePostImageSelector = 'div._5r69 img';
let suggestPostImageSelector = 'div._4ozq img';

//yeah yeah took a bunch of strings to an array to string
let selectorsToHide = [
    userImageSelector,
    sharedImageSelector,
    sharedLinkImageSelector,
    'video',
    '.ego_column img',
    pagePostImageSelector].toString();

function replaceImages(imagesToReplace) {
    // otherwise errors
    if (imagesToReplace.length !== 0) {

        imagesToReplace.forEach(function (image) {

            // prevents a million goddamn buttons
            if (!image.classList.contains(
                'gm-Replaced')
                // // not strictly necessary ...
                // && image.parentElement.classList .contains('uiScaledImageContainer')
               ) {

                let someLink = image.closest('a');

                let sourceButton = document.createElement(
                    'BUTTON');

                sourceButton.innerHTML =
                    'Show&nbsp;original';
                sourceButton.style =
                    `
background-color: hsla(180, 90%, 50%, 0.3);
color: black; width:100%;
display: inline-block;`;

                someLink.insertAdjacentElement(
                    'beforebegin', sourceButton);

                image.dataset.originalImage = image.src;
                image.src = replacementImg;
                image.style =
                    'max-width: 100%; height: auto;';

                sourceButton.addEventListener("click",
                                              function (event) {
                    if (image.src ===
                        replacementImg) {
                        image.src = image.dataset
                            .originalImage;

                        sourceButton.innerText =
                            'Show replacement';

                    } else {
                        image.sourceurl =
                            'http://www.thecatapi.com';
                        image.src =
                            replacementImg;
                        sourceButton.innerText =
                            'Show original';
                    }

                    return false;

                }, true);

                image.classList.add('gm-Replaced');
            }

        });
    }
}

// run once at page-load.
document.addEventListener('DOMContentLoaded', function (event) {
    let imagesToReplace = document.body.querySelectorAll(
        selectorsToHide);

    replaceImages(imagesToReplace);
});

// select the target node
var sectionOfDomToObserve = document.getElementById(
    'contentArea');

// create an observer instance
var observer = new MutationObserver(
    function (mutations) {
        mutations.forEach(function (mutation) {

            // if (mutation.target.id.startsWith('hyperfeed')) {
            if (mutation.target) {

                let imagesToReplace = mutation.target
                .querySelectorAll(
                    selectorsToHide);

                replaceImages(imagesToReplace);
            }
        });
    });

// configuration of the observer:
var config = {
    // these first three (attributes, childList, characterData) must be true
    attributes: true,
    childList: true,
    characterData: true,

    // this allows it to walk down every object, which is also necessary
    subtree: true
};

// pass in the target node, as well as the observer options
// observer.observe(sectionOfDomToObserve, config);
observer.observe(document.documentElement, config);
