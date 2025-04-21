import products from './products.js';

products()
  .then(data => data.data)
  .then(allProducts => {
    const resultsContainer = document.getElementById('results');
    const input = document.querySelector('.search');
    const searchButton = document.querySelector('.searchButton');

    // Function to display product cards
    function displayNames(list) {
      resultsContainer.innerHTML = ''; // Clear previous results

      list.forEach(product => {
        const card = document.createElement('div');
        card.className = 'item-card';

        const productImage = product.image || 'path_to_default_image.jpg'; // Fallback if image is missing

        card.innerHTML = `
          <img src="${productImage}" alt="${product.name}" />
          <div class="info">
            <div class="title">${product.name}</div>
            <div class="price">${product.price}$</div>
            <a href="${product.link}" target="_blank">View Product</a>
          </div>
        `;

        resultsContainer.appendChild(card);
      });
    }

    displayNames(allProducts);

    // Filter function (live search)
    function toFilter(value) {
      const searchValue = value.trim().toLowerCase();
      if (!searchValue) return allProducts;

      const inputWords = searchValue.split(/\s+/);

      return allProducts.filter(product => {
        const productWords = product.name.trim().toLowerCase().split(/\s+/);
        return productWords.some(productWord =>
          inputWords.some(inputWord =>
            productWord.startsWith(inputWord)
          )
        );
      });
    }

    // Search function (returns only the first match)
    function toSearch(value) {
      const filteredNames = toFilter(value);
      return filteredNames.length > 0 ? [filteredNames[0]] : [];
    }

    // Listen for typing
    input.addEventListener('input', () => {
      displayNames(toFilter(input.value));
    });

    // Listen for Enter and Space keys
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        displayNames(toSearch(input.value));
      }
      if (event.key === ' ') {
        // Just filter again on space
        displayNames(toFilter(input.value));
      }
    });

    // Search button click
    searchButton.addEventListener('click', () => {
      displayNames(toSearch(input.value));
    });
  });
