document.addEventListener('DOMContentLoaded', () => {
  afficherCommandes();
  // Rafraîchissement automatique toutes les 5 secondes
  setInterval(afficherCommandes, 5000);
});

function afficherCommandes() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.email) {
    document.getElementById('commandes-en-cours').innerHTML = '<p>Veuillez vous connecter pour voir vos commandes.</p>';
    document.getElementById('historique-commandes').innerHTML = '';
    return;
  }

  const commandesEnCours = (JSON.parse(localStorage.getItem('commandesEnCours')) || []).filter(cmd => cmd.email === user.email);
  const commandesTerminees = (JSON.parse(localStorage.getItem('commandesTerminees')) || []).filter(cmd => cmd.email === user.email);

  // Affichage des commandes en cours
  let htmlEnCours = '';
  if (commandesEnCours.length > 0) {
    htmlEnCours += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes en cours</h3><ul style='list-style:none;padding:0;'>`;
    commandesEnCours.forEach((cmd, i) => {
      htmlEnCours += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span><br>
        <span style='color:#888;'>Commande passée le : ${cmd.dateCommande ? cmd.dateCommande : 'Non renseignée'}</span><br>
        <span style='color:#007bff;font-weight:bold;'>${cmd.etat ? cmd.etat : 'En préparation'}</span><br>
        <span style='color:#888;'>Dernière mise à jour du statut : ${cmd.dateMajEtat ? cmd.dateMajEtat : (cmd.dateCommande ? cmd.dateCommande : 'Non renseignée')}</span>
        ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
      </li>`;
    });
    htmlEnCours += '</ul></div>';
  } else {
    htmlEnCours = '<p>Aucune commande en cours.</p>';
  }
  document.getElementById('commandes-en-cours').innerHTML = htmlEnCours;

  // Affichage de l'historique des commandes
  let htmlHist = '';
  if (commandesTerminees.length > 0) {
    htmlHist += `<div class='main-card' style='margin-top:2rem;'><h3>Historique des commandes (commandes livrées)</h3><ul style='list-style:none;padding:0;'>`;
    commandesTerminees.forEach(cmd => {
      htmlHist += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span><br>
        <span style='color:#888;'>Commande passée le : ${cmd.dateCommande ? cmd.dateCommande : 'Non renseignée'}</span><br>
        <span style='color:green;font-weight:bold;'>Commande livrée</span><br>
        <span style='color:#888;'>Dernière mise à jour du statut : ${cmd.dateMajEtat ? cmd.dateMajEtat : (cmd.dateCommande ? cmd.dateCommande : 'Non renseignée')}</span>
        ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
      </li>`;
    });
    htmlHist += '</ul></div>';
  } else {
    htmlHist = '<p>Aucune commande livrée.</p>';
  }

  // Affichage des commandes annulées
  let commandesAnnulees = JSON.parse(localStorage.getItem('commandesAnnulees')) || [];
  let htmlAnnulees = '';
  if (commandesAnnulees.length > 0) {
    const annuleesUser = commandesAnnulees.filter(cmd => cmd.email === user.email);
    if (annuleesUser.length > 0) {
      htmlAnnulees += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes annulées</h3><ul style='list-style:none;padding:0;'>`;
      annuleesUser.forEach(cmd => {
        htmlAnnulees += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
          <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
          ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
          <span style='color:#d9534f;font-weight:bold;'>Commande annulée</span><br>
          ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
        </li>`;
      });
      htmlAnnulees += '</ul></div>';
    }
  }
  document.getElementById('historique-commandes').innerHTML = htmlHist + htmlAnnulees;
}
