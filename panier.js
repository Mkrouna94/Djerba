document.addEventListener('DOMContentLoaded', () => {
  const panierContainer = document.getElementById('panier-container');
  const panier = JSON.parse(localStorage.getItem('panier')) || [];

  if (panier.length === 0) {
    panierContainer.innerHTML = '<p>Votre panier est vide.</p>';
    document.getElementById('commande-section').innerHTML = '';
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

    // Ajout du bouton Passer la commande
    const commandeSection = document.getElementById('commande-section');
    commandeSection.innerHTML = '';
    const commanderBtn = document.createElement('button');
    commanderBtn.textContent = 'Passer la commande et payer';
    commanderBtn.className = 'profil-save-btn';
    commanderBtn.style.marginTop = '1.5rem';
    commandeSection.appendChild(commanderBtn);

    commanderBtn.addEventListener('click', () => {
      // Étape adresse complète améliorée
      const user = JSON.parse(localStorage.getItem('user')) || {};
      let nom = user.nom || '';
      let prenom = user.prenom || '';
      let adresse = user.adresse || '';
      let ville = user.ville || '';
      let codepostal = user.codepostal || '';
      let infos = user.infos || '';
      let formHtml = `
        <form id="form-adresse-commande" class="styled-form" style="max-width:440px;margin:2rem auto;background:rgba(255,255,255,0.98);padding:2rem 2.5rem;border-radius:16px;box-shadow:0 2px 12px 0 rgba(31,38,135,0.10);">
          <h3 style='text-align:center;margin-bottom:1.5rem;'>Adresse de livraison</h3>
          <div class="form-group"><label for="nom-commande">Nom</label><input type="text" id="nom-commande" name="nom" required value="${nom}"></div>
          <div class="form-group"><label for="prenom-commande">Prénom</label><input type="text" id="prenom-commande" name="prenom" required value="${prenom}"></div>
          <div class="form-group"><label for="adresse-commande">Adresse</label><input type="text" id="adresse-commande" name="adresse" required value="${adresse}"></div>
          <div class="form-group"><label for="ville-commande">Ville</label><input type="text" id="ville-commande" name="ville" required value="${ville}"></div>
          <div class="form-group"><label for="codepostal-commande">Code postal</label><input type="text" id="codepostal-commande" name="codepostal" required value="${codepostal}"></div>
          <div class="form-group"><label for="infos-commande">Informations supplémentaires (étage, résidence...)</label><input type="text" id="infos-commande" name="infos" value="${infos}"></div>
          <button type="submit" class="profil-save-btn" style="margin-top:1.2rem;width:100%;font-size:1.1rem;">Valider et payer</button>
        </form>`;
      commandeSection.innerHTML = formHtml;
      document.getElementById('form-adresse-commande').addEventListener('submit', function(e) {
        e.preventDefault();
        nom = document.getElementById('nom-commande').value;
        prenom = document.getElementById('prenom-commande').value;
        adresse = document.getElementById('adresse-commande').value;
        ville = document.getElementById('ville-commande').value;
        codepostal = document.getElementById('codepostal-commande').value;
        infos = document.getElementById('infos-commande').value;
        // Sauvegarde dans le profil utilisateur
        let user = JSON.parse(localStorage.getItem('user')) || {};
        user.nom = nom;
        user.prenom = prenom;
        user.adresse = adresse;
        user.ville = ville;
        user.codepostal = codepostal;
        user.infos = infos;
        localStorage.setItem('user', JSON.stringify(user));
        // Étape paiement simulée
        commandeSection.innerHTML = `<div style='text-align:center;'><h3>Choisissez votre moyen de paiement</h3>
          <button id='payer-cb' class='profil-save-btn' style='margin:1rem;'>Carte Bancaire</button>
          <button id='payer-espece' class='profil-save-btn' style='margin:1rem;'>Espèces à la livraison</button>
        </div>`;
        document.getElementById('payer-cb').onclick = () => {
          enregistrerCommande('cb', {nom, prenom, adresse, ville, codepostal, infos});
        };
        document.getElementById('payer-espece').onclick = () => {
          enregistrerCommande('espece', {nom, prenom, adresse, ville, codepostal, infos});
        };
      });
    });

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

// Ajout de la gestion des commandes en cours et terminées
function afficherCommandes() {
  const section = document.getElementById('commande-section');
  let commandesEnCours = JSON.parse(localStorage.getItem('commandesEnCours')) || [];
  let commandesTerminees = JSON.parse(localStorage.getItem('commandesTerminees')) || [];
  let html = '';
  if (commandesEnCours.length > 0) {
    html += `<div class='main-card' style='margin-top:2rem;'><h3>Commande en cours</h3><ul style='list-style:none;padding:0;'>`;
    commandesEnCours.forEach((cmd, i) => {
      html += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span>
        <br><button class='terminer-commande' data-index='${i}' style='margin-top:0.5rem;'>Marquer comme terminée</button>
      </li>`;
    });
    html += '</ul></div>';
  }
  if (commandesTerminees.length > 0) {
    html += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes terminées</h3><ul style='list-style:none;padding:0;'>`;
    commandesTerminees.forEach(cmd => {
      html += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span>
      </li>`;
    });
    html += '</ul></div>';
  }
  section.insertAdjacentHTML('beforeend', html);
  // Gestion du bouton terminer
  document.querySelectorAll('.terminer-commande').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-index'));
      const cmd = commandesEnCours.splice(idx, 1)[0];
      commandesTerminees.push(cmd);
      localStorage.setItem('commandesEnCours', JSON.stringify(commandesEnCours));
      localStorage.setItem('commandesTerminees', JSON.stringify(commandesTerminees));
      section.innerHTML = '';
      afficherCommandes();
    };
  });
}

function enregistrerCommande(paiement, infos) {
  let commandesEnCours = JSON.parse(localStorage.getItem('commandesEnCours')) || [];
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const now = new Date();
  const dateCommande = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
  const cmd = {...infos, paiement, articles: panier, email: user.email, dateCommande, dateMajEtat: dateCommande};
  commandesEnCours.push(cmd);
  localStorage.setItem('commandesEnCours', JSON.stringify(commandesEnCours));
  localStorage.removeItem('panier');
  // Redirection vers la page Mes commandes après validation
  window.location.href = 'mes-commandes.html';
}

// Affichage de l'historique à l'ouverture de la page
if (document.getElementById('commande-section')) {
  afficherCommandes();
}
