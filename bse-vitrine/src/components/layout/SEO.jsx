import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const fullTitle = title
    ? title + ' | Burkina Solar Energy'
    : 'Burkina Solar Energy — Énergie Solaire & Électronique à Ouagadougou';

  const fullDescription = description ||
    "Burkina Solar Energy (BSE) vend panneaux solaires, onduleurs, batteries et électronique grand public à Ouagadougou. Commandez via WhatsApp.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;