document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // Restriction d'accès : uniquement admin
  if (!user || !user.email || !user.role || user.role !== 'admin') {
    document.body.innerHTML = '<div style="text-align:center;margin-top:4rem;"><h2>Accès réservé aux administrateurs.</h2><a href="index.html">Retour à l\'accueil</a></div>';
    return;
  }

  const commandesEnCours = JSON.parse(localStorage.getItem('commandesEnCours')) || [];
  const commandesTerminees = JSON.parse(localStorage.getItem('commandesTerminees')) || [];
  const commandesAnnulees = JSON.parse(localStorage.getItem('commandesAnnulees')) || [];

  let html = '';
  if (commandesEnCours.length > 0) {
    html += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes en cours</h3><ul style='list-style:none;padding:0;'>`;
    commandesEnCours.forEach((cmd, i) => {
      html += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span><br>
        <span style='color:#888;'>Commande passée le : ${cmd.dateCommande ? cmd.dateCommande : 'Non renseignée'}</span><br>
        <label>État :
          <select class='etat-commande' data-index='${i}'>
            <option value='En préparation' ${cmd.etat === 'En préparation' ? 'selected' : ''}>En préparation</option>
            <option value='En livraison' ${cmd.etat === 'En livraison' ? 'selected' : ''}>En livraison</option>
            <option value='Livrée' ${cmd.etat === 'Livrée' ? 'selected' : ''}>Livrée</option>
          </select>
        </label>
        <button class='annuler-commande' data-index='${i}' style='margin-left:1rem;background:#d9534f;'>Annuler</button>
        ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles commandés :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
      </li>`;
    });
    html += '</ul></div>';
  } else {
    html += '<p>Aucune commande en cours.</p>';
  }

  if (commandesTerminees.length > 0) {
    html += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes livrées (historique)</h3><ul style='list-style:none;padding:0;'>`;
    commandesTerminees.forEach(cmd => {
      html += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#ffcc00;font-weight:bold;'>Paiement : ${cmd.paiement === 'cb' ? 'Carte Bancaire' : 'Espèces'}</span><br>
        <span style='color:green;font-weight:bold;'>Commande livrée</span>
        ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles commandés :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
      </li>`;
    });
    html += '</ul></div>';
  }

  if (commandesAnnulees.length > 0) {
    html += `<div class='main-card' style='margin-top:2rem;'><h3>Commandes annulées</h3><ul style='list-style:none;padding:0;'>`;
    commandesAnnulees.forEach(cmd => {
      html += `<li style='margin-bottom:1.2rem;padding:1rem 0;border-bottom:1px solid #eee;'>
        <b>${cmd.nom} ${cmd.prenom}</b> - ${cmd.adresse}, ${cmd.ville} (${cmd.codepostal})<br>
        ${cmd.infos ? 'Infos : ' + cmd.infos + '<br>' : ''}
        <span style='color:#d9534f;font-weight:bold;'>Commande annulée</span><br>
        ${cmd.articles && cmd.articles.length > 0 ? `<div style='margin-top:0.7rem;'><b>Articles commandés :</b><ul style='margin:0.5rem 0 0 1.2rem;padding:0;'>${cmd.articles.map(a => `<li>${a.nom} (${a.quantite})</li>`).join('')}</ul></div>` : ''}
      </li>`;
    });
    html += '</ul></div>';
  }
  document.getElementById('admin-commandes').innerHTML = html;

  // Gestion du changement d'état
  document.querySelectorAll('.etat-commande').forEach(select => {
    select.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-index'));
      const newEtat = this.value;
      const now = new Date();
      commandesEnCours[idx].etat = newEtat;
      commandesEnCours[idx].dateMajEtat = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
      // Si livrée, déplacer dans commandesTerminees
      if (newEtat === 'Livrée') {
        const cmd = commandesEnCours.splice(idx, 1)[0];
        commandesTerminees.push(cmd);
      }
      localStorage.setItem('commandesEnCours', JSON.stringify(commandesEnCours));
      localStorage.setItem('commandesTerminees', JSON.stringify(commandesTerminees));
      location.reload();
    });
  });
  // Gestion du bouton annuler
  document.querySelectorAll('.annuler-commande').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-index'));
      if(confirm('Voulez-vous vraiment annuler cette commande ?')){
        const cmd = commandesEnCours.splice(idx, 1)[0];
        commandesAnnulees.push(cmd);
        localStorage.setItem('commandesEnCours', JSON.stringify(commandesEnCours));
        localStorage.setItem('commandesAnnulees', JSON.stringify(commandesAnnulees));
        location.reload();
      }
    });
  });
});
