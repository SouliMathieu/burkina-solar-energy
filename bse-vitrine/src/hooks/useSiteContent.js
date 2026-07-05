import { useState, useEffect } from 'react';
import { getSiteContent } from '../services/api';

const defaultContent = {
  slogan: "L'énergie du soleil, la force du Burkina",
  about_titre: "Qui sommes-nous ?",
  about_texte: "Burkina Solar Energy (BSE) est une entreprise burkinabè spécialisée dans la vente et l'installation de matériel d'énergie solaire et de produits électroniques.",
  compteur_clients: "500",
  compteur_projets: "300",
  compteur_experience: "10",
  contact_telephone: "+226 67 44 82 82",
  contact_telephone_2: "",
  contact_email: "contact@burkina-solar.com",
  contact_email_2: "",
  contact_adresse: "Ouagadougou, Burkina Faso",
  contact_horaires: "Lun - Sam : 8h00 - 18h00",
  whatsapp_number: "22667448282",
  social_facebook: "#",
  social_instagram: "#",
  social_whatsapp: "22667448282",
  maps_lien: "",
  hero_titre_1: "L'Énergie Solaire au Service du Burkina Faso",
  hero_sous_titre_1: "Des solutions solaires fiables et accessibles pour votre maison et votre entreprise",
  hero_titre_2: "Votre Spécialiste en Énergie Renouvelable",
  hero_sous_titre_2: "Panneaux, onduleurs, batteries — tout pour votre autonomie énergétique",
  hero_titre_3: "Électronique Grand Public de Qualité",
  hero_sous_titre_3: "Téléphones, tablettes et accessoires aux meilleurs prix à Ouagadougou",
  hero_titre_4: "Des projets réalisés partout au Burkina",
  hero_sous_titre_4: "Plus de 500 clients satisfaits — particuliers, entreprises et institutions",
  hero_titre_5: "Contactez-nous dès aujourd'hui",
  hero_sous_titre_5: "Estimation gratuite — réponse rapide sur WhatsApp",
  hero_image_1: "",
  hero_image_2: "",
  hero_image_3: "",
  hero_image_4: "",
  hero_image_5: "",
};

const useSiteContent = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent()
      .then((res) => {
        if (res.data && res.data.data) {
          setContent({ ...defaultContent, ...res.data.data });
        }
      })
      .catch(() => {
        // Utilise les valeurs par défaut en cas d'erreur
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
};

export default useSiteContent;