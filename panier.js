document.addEventListener('DOMContentLoaded', () => {
  const panierContainer = document.getElementById('panier-container');
  const panier = JSON.parse(localStorage.getItem('panier')) || [];

  if (panier.length === 0) {
    panierContainer.innerHTML = '<p>Votre panier est vide.</p>';
  } else {

    let total = 0;
    panier.forEach((produit, index) => {
      // Prix remisé si promotion
      const prixNum = parseFloat(produit.prix) || 0;
      const promo = parseFloat(produit.promotion) || 0;
      const quantite = parseInt(produit.quantite) || 1;
      const prixFinal = promo > 0 ? prixNum * (1 - promo / 100) : prixNum;
      total += prixFinal * quantite;
      const produitElement = document.createElement('div');
      produitElement.classList.add('produit');
      produitElement.innerHTML = `
        <div class="produit">
          <img src="Images/${produit.image}" alt="${produit.nom}">
          <button class="remove-from-cart" data-index="${index}">×</button>
          <h3>${produit.nom}</h3>
          <p>
            ${promo > 0 ? `<span class='old-price'>${prixNum.toFixed(2)} €</span> <span class='new-price'>${prixFinal.toFixed(2)} €</span> <span class='discount'>${promo}%</span>` : `${prixNum.toFixed(2)} €`}
          </p>
          <div class="quantite-panier">
            <button class="quantite-moins" data-index="${index}">-</button>
            <span>Quantité : <strong>${quantite}</strong></span>
            <button class="quantite-plus" data-index="${index}">+</button>
          </div>
          <p class="description">${produit.description || 'Aucune description disponible.'}</p>
        </div>
      `;
      panierContainer.appendChild(produitElement);
    });

    // Affichage du total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'panier-total';
    totalDiv.innerHTML = `<h3>Total du panier : ${total.toFixed(2)} €</h3>`;
    panierContainer.appendChild(totalDiv);

    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        panier.splice(index, 1);
        localStorage.setItem('panier', JSON.stringify(panier));
        location.reload();
      });
    });

    // Gestion des boutons + et - pour la quantité
    document.querySelectorAll('.quantite-plus').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        panier[index].quantite = (panier[index].quantite || 1) + 1;
        localStorage.setItem('panier', JSON.stringify(panier));
        location.reload();
      });
    });
    document.querySelectorAll('.quantite-moins').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        if ((panier[index].quantite || 1) > 1) {
          panier[index].quantite -= 1;
        } else {
          panier.splice(index, 1);
        }
        localStorage.setItem('panier', JSON.stringify(panier));
        location.reload();
      });
    });
  }
});
