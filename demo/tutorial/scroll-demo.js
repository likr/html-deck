// This is a long script to test the scrollable codeblock feature
function processSlides(deck) {
  console.log("Initializing deck...");
  const slides = deck.querySelectorAll('hd-slide, hd-title-slide');
  slides.forEach((slide, index) => {
    console.log(`Configuring slide ${index + 1} of ${slides.length}`);
    slide.setAttribute('page-index', index + 1);
    slide.setAttribute('page-total', slides.length);
    if (slide.tagName === 'HD-TITLE-SLIDE') {
      console.log("Skipping numbering for title slide.");
    }
  });
  console.log("Deck processing complete.");
}
