const form = document.getElementById('ajout-produit-form');
const produits = JSON.parse(localStorage.getItem('produits')) || [];
const listeProduits = document.getElementById('liste-produits');
const listePromotions = document.getElementById('liste-promotions');

// Suppression des produits ajoutés en dur
if (produits.length === 0) {
  localStorage.setItem('produits', JSON.stringify([]));
}

// Ajout de la fonctionnalité de modification
const modifierProduit = (index) => {
  const produit = produits[index];
  document.getElementById('nom-produit').value = produit.nom;
  document.getElementById('prix-produit').value = produit.prix;
  document.getElementById('image-produit').value = produit.image;
  document.getElementById('categorie-produit').value = produit.categorie;
  document.getElementById('promotion-produit').value = produit.promotion || 0;
  document.getElementById('description-produit').value = produit.description || ''; // Nouvelle description

  form.removeEventListener('submit', ajouterProduit);
  form.addEventListener('submit', function modifier(e) {
    e.preventDefault();
    produit.nom = document.getElementById('nom-produit').value;
    produit.prix = parseFloat(document.getElementById('prix-produit').value).toFixed(2);
    produit.image = document.getElementById('image-produit').value;
    produit.categorie = document.getElementById('categorie-produit').value;
    produit.promotion = parseInt(document.getElementById('promotion-produit').value) || 0;
    produit.description = document.getElementById('description-produit').value; // Nouvelle description

    localStorage.setItem('produits', JSON.stringify(produits));
    afficherProduits();
    form.reset();
    form.removeEventListener('submit', modifier);
    form.addEventListener('submit', ajouterProduit);
  });
};

// Suppression de l'appel à fetch et ajout de validations pour les champs du formulaire
const ajouterProduit = (e) => {
  e.preventDefault();

  const nom = document.getElementById('nom-produit').value.trim();
  const prix = parseFloat(document.getElementById('prix-produit').value);
  const image = document.getElementById('image-produit').value.trim();
  const categorie = document.getElementById('categorie-produit').value.trim();
  const promotion = parseInt(document.getElementById('promotion-produit').value) || 0;
  const description = document.getElementById('description-produit').value.trim();

  // Validation des champs
  if (!nom || isNaN(prix) || !image || !categorie || !description) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  produits.push({ nom, prix: prix.toFixed(2), image, categorie, promotion, description });
  localStorage.setItem('produits', JSON.stringify(produits));

  alert('Produit ajouté avec succès !');
  afficherProduits();
  form.reset();
};

form.addEventListener('submit', ajouterProduit);

// Modification de l'affichage pour inclure un bouton de modification
const afficherProduits = () => {

  // Affichage des produits en promotion
  if (listePromotions) {
    listePromotions.innerHTML = '';
    produits.forEach((produit, index) => {
      if (produit.promotion && produit.promotion > 0) {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="Images/${produit.image}" alt="${produit.nom}" style="width: 50px; height: auto;">
          <strong>${produit.nom}</strong> - ${produit.prix} € - ${produit.categorie} - Promotion: ${produit.promotion}%
          <p>Description : ${produit.description}</p>
          <span style="color:${produit.indisponible ? 'red' : 'green'};font-weight:bold;">${produit.indisponible ? 'Indisponible' : 'Disponible'}</span>
          <button data-index="${index}" class="modifier-produit">Modifier</button>
          <button data-index="${index}" class="supprimer-produit">Supprimer</button>
          <button data-index="${index}" class="toggle-indispo">${produit.indisponible ? 'Rendre disponible' : 'Rendre indisponible'}</button>
        `;
        listePromotions.appendChild(li);
      }
    });
  }

  // Affichage des autres produits
  listeProduits.innerHTML = '';
  produits.forEach((produit, index) => {
    if (!produit.promotion || produit.promotion == 0) {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="Images/${produit.image}" alt="${produit.nom}" style="width: 50px; height: auto;">
        <strong>${produit.nom}</strong> - ${produit.prix} € - ${produit.categorie} - Promotion: ${produit.promotion}%
        <p>Description : ${produit.description}</p>
        <span style="color:${produit.indisponible ? 'red' : 'green'};font-weight:bold;">${produit.indisponible ? 'Indisponible' : 'Disponible'}</span>
        <button data-index="${index}" class="modifier-produit">Modifier</button>
        <button data-index="${index}" class="supprimer-produit">Supprimer</button>
        <button data-index="${index}" class="toggle-indispo">${produit.indisponible ? 'Rendre disponible' : 'Rendre indisponible'}</button>
      `;
      listeProduits.appendChild(li);
    }
  });

  document.querySelectorAll('.supprimer-produit').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      produits.splice(index, 1);
      localStorage.setItem('produits', JSON.stringify(produits));
      afficherProduits();
    });
  });

  document.querySelectorAll('.modifier-produit').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      modifierProduit(index);
    });
  });

  document.querySelectorAll('.toggle-indispo').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      produits[index].indisponible = !produits[index].indisponible;
      localStorage.setItem('produits', JSON.stringify(produits));
      afficherProduits();
    });
  });
};

// Appel initial pour afficher tous les produits
afficherProduits();