document.addEventListener('DOMContentLoaded', () => {
  const favorisContainer = document.getElementById('favoris-container');
  const favoris = JSON.parse(localStorage.getItem('favoris')) || [];

  if (favoris.length === 0) {
    favorisContainer.innerHTML = '<p>Aucun produit dans vos favoris.</p>';
  } else {
    favoris.forEach((produit, index) => {
      const produitElement = document.createElement('div');
      produitElement.classList.add('produit');
      // Recherche des infos complètes du produit dans le localStorage produits
      const produitsLS = JSON.parse(localStorage.getItem('produits')) || [];
      const prodLS = produitsLS.find(p => p.nom === produit.nom);
      const image = prodLS && prodLS.image ? prodLS.image : (produit.image || 'placeholder.jpg');
      const prix = prodLS && prodLS.prix ? prodLS.prix : (produit.prix || '');
      const description = prodLS && prodLS.description ? prodLS.description : (produit.description || 'Aucune description disponible.');
      const promotion = prodLS && prodLS.promotion ? prodLS.promotion : (produit.promotion || 0);
      produitElement.innerHTML = `
        <button class="remove-from-favoris" data-index="${index}">×</button>
        <img src="Images/${image}" alt="${produit.nom}">
        <h3>${produit.nom}</h3>
        <p>${promotion > 0 ? `<span class='old-price'>${prix} €</span> <span class='new-price'>${(prix * (1 - promotion / 100)).toFixed(2)} €</span>` : `${prix} €`}</p>
        <p class="description">${description}</p>
        <div class="ajout-panier-quantite">
          <input type="number" min="1" value="1" class="input-quantite" style="width: 60px; margin-right: 0.5rem;">
          <button class="add-to-cart" data-nom="${produit.nom}" data-prix="${prix}" data-description="${description}" data-image="${image}" data-promotion="${promotion}">Ajouter au panier</button>
        </div>
      `;
      favorisContainer.appendChild(produitElement);
    });

    document.querySelectorAll('.remove-from-favoris').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        favoris.splice(index, 1);
        localStorage.setItem('favoris', JSON.stringify(favoris));
        location.reload();
      });
    });
  }

  document.querySelectorAll('.add-to-favoris').forEach(button => {
    button.addEventListener('click', () => {
      const nom = button.getAttribute('data-nom');
      const prix = button.getAttribute('data-prix');
      const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
      if (!favoris.some(produit => produit.nom === nom)) {
        favoris.push({ nom, prix });
        localStorage.setItem('favoris', JSON.stringify(favoris));
        alert(`${nom} a été ajouté à vos favoris !`);
      } else {
        alert(`${nom} est déjà dans vos favoris !`);
      }
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const nom = button.getAttribute('data-nom');
      const prix = button.getAttribute('data-prix');
      const description = button.getAttribute('data-description');
      const image = button.getAttribute('data-image');
      const promotion = button.getAttribute('data-promotion') || 0;
      // Récupérer la quantité sélectionnée
      let quantite = 1;
      const parent = button.closest('.ajout-panier-quantite');
      if (parent) {
        const inputQ = parent.querySelector('.input-quantite');
        if (inputQ && parseInt(inputQ.value) > 0) {
          quantite = parseInt(inputQ.value);
        }
      }
      let panier = JSON.parse(localStorage.getItem('panier')) || [];
      // Chercher si le produit existe déjà (même nom, même promotion)
      const indexProduit = panier.findIndex(p => p.nom === nom && p.promotion == promotion);
      if (indexProduit !== -1) {
        panier[indexProduit].quantite = (panier[indexProduit].quantite || 1) + quantite;
      } else {
        panier.push({ nom, prix, description, image, promotion, quantite });
      }
      localStorage.setItem('panier', JSON.stringify(panier));
      alert(`${nom} a été ajouté à votre panier !`);
    });
  });
});
